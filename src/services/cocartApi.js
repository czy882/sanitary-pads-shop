// src/services/cocartApi.js
import { http } from "../lib/http";

// 中文注释：CoCart API 基址（你 env 里是 VITE_COCART_API=https://estora.au/wp-json/cocart/v2）
const COCART_BASE =
  import.meta.env.VITE_COCART_API || "/wp-json/cocart/v2";

// 中文注释：获取购物车
export function getCart() {
  return http(`${COCART_BASE}/cart`, {
    method: "GET",
  });
}

// ✅ 关键修复：加入购物车必须发送 { id, quantity }
export function addToCart(productId, quantity = 1) {
  const id = Number(productId);
  const qty = Math.max(1, Number(quantity) || 1);

  return http(`${COCART_BASE}/cart/add-item`, {
    method: "POST",
    body: {
      id,           // ✅ 注意：必须叫 id，不是 product_id
      quantity: qty // ✅ 注意：必须叫 quantity
    },
  });
}

// 中文注释：更新某个 item（CoCart v2：/cart/item/{item_key}）
export function updateCartItem(itemKey, quantity) {
  const qty = Number(quantity);
  return http(`${COCART_BASE}/cart/item/${encodeURIComponent(itemKey)}`, {
    method: "POST",
    body: { quantity: Number.isNaN(qty) ? 1 : qty },
  });
}

// 中文注释：清空购物车
export function clearCart() {
  return http(`${COCART_BASE}/cart/clear`, {
    method: "POST",
  });
}