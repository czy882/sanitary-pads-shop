import { http } from "../lib/http";

// 中文注释：CoCart API 基础路径
const COCART_BASE = import.meta.env.VITE_COCART_API || "/wp-json/cocart/v2";

// 中文注释：获取购物车
export function getCart() {
  return http(`${COCART_BASE}/cart`);
}

// 中文注释：添加商品到购物车
export function addToCart(productId, quantity = 1) {
  return http(`${COCART_BASE}/cart/add-item`, {
    method: "POST",
    body: JSON.stringify({
      id: productId,
      quantity,
    }),
  });
}

// 中文注释：更新购物车某项数量（itemKey 从 getCart() 返回里拿）
export function updateCartItem(itemKey, quantity) {
  return http(`${COCART_BASE}/cart/item/${itemKey}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
}

// 中文注释：清空购物车
export function clearCart() {
  return http(`${COCART_BASE}/cart/clear`, { method: "POST" });
}
