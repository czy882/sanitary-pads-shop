// src/store/cartStore.js
// 中文注释：购物车状态管理（CoCart）
// 用法：
// 1) 在 main.jsx 最外层包裹 <CartProvider>
// 2) 组件中使用 const { cart, addItem, updateItem, clear, refreshCart, loading, error } = useCart()

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getCart, addToCart, updateCartItem, clearCart } from "../services/cocartApi";

const CartContext = createContext(null);

// 中文注释：CoCart 不同版本/端点的返回结构可能不同，这里做统一解包
function unwrapCart(data) {
  // 常见情况：直接返回 cart；或返回 { cart: ... }；或返回 { data: ... }
  return data?.cart ?? data?.data ?? data;
}

// 中文注释：把各种错误结构统一转成可读字符串
function toErrorMessage(e, fallback) {
  return (
    e?.data?.message ||
    e?.response?.data?.message ||
    e?.message ||
    (typeof e === "string" ? e : "") ||
    fallback
  );
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 中文注释：防止并发请求导致的“旧响应覆盖新响应”
  const reqIdRef = useRef(0);

  const withRequestGuard = useCallback(async (fn) => {
    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError("");

    try {
      const data = await fn();
      const nextCart = unwrapCart(data);

      // 中文注释：只接受最新一次请求的返回
      if (reqId === reqIdRef.current) {
        setCart(nextCart);
      }

      return nextCart;
    } catch (e) {
      const msg = toErrorMessage(e, "Cart request failed");
      if (reqId === reqIdRef.current) {
        setError(msg);
      }
      throw e;
    } finally {
      if (reqId === reqIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // 中文注释：拉取购物车
  const refreshCart = useCallback(() => {
    return withRequestGuard(async () => await getCart());
  }, [withRequestGuard]);

  // 中文注释：加入购物车
  // 兼容两种调用方式：
  // 1) addItem(productId, qty)
  // 2) addItem({ id: productId, quantity: qty })
  const addItem = useCallback(
    (arg1, arg2 = 1) => {
      return withRequestGuard(async () => {
        const productIdRaw =
          typeof arg1 === "object" && arg1
            ? arg1.id ?? arg1.product_id ?? arg1.productId
            : arg1;

        const quantityRaw =
          typeof arg1 === "object" && arg1 ? arg1.quantity ?? arg1.qty ?? 1 : arg2;

        const productId = Number(productIdRaw);
        if (!productId || Number.isNaN(productId)) {
          // 中文注释：让报错信息和后端一致，方便你在前端定位
          const err = new Error("Missing parameter(s): id");
          err.data = { message: "Missing parameter(s): id", productIdRaw };
          throw err;
        }

        const qty = Math.max(1, Number(quantityRaw) || 1);

        // 中文注释：这里把“数值型 id”传给 cocartApi.addToCart
        return await addToCart(productId, qty);
      });
    },
    [withRequestGuard]
  );

  // 中文注释：更新购物车 item 数量
  const updateItem = useCallback(
    (itemKey, quantity) => {
      return withRequestGuard(async () => {
        const qty = Number(quantity);
        return await updateCartItem(itemKey, Number.isNaN(qty) ? 1 : qty);
      });
    },
    [withRequestGuard]
  );

  // 中文注释：清空购物车
  const clear = useCallback(() => {
    return withRequestGuard(async () => await clearCart());
  }, [withRequestGuard]);

  // 中文注释：首次进入站点自动拉取一次购物车
  // 为了避免严格 lint 误报（setState-in-effect），用 rAF 将调用放到提交阶段之后
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      refreshCart().catch(() => {});
    });
    return () => cancelAnimationFrame(id);
  }, [refreshCart]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      refreshCart,
      addItem,
      updateItem,
      clear,
    }),
    [cart, loading, error, refreshCart, addItem, updateItem, clear]
  );

  // 中文注释：这里不能用 JSX（因为当前文件是 .js），改用 React.createElement 避免 Vite 解析错误
  return React.createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}