import { http } from "../lib/http";

// 中文注释：Woo Store API 基础路径
const WC_STORE_BASE = import.meta.env.VITE_WC_STORE_API || "/wp-json/wc/store/v1";

// 中文注释：获取产品列表
export function getProducts(params = {}) {
  const query = new URLSearchParams({
    per_page: String(params.per_page ?? 20),
    orderby: params.orderby ?? "menu_order",
    order: params.order ?? "asc",
  });

  return http(`${WC_STORE_BASE}/products?${query.toString()}`);
}

// 中文注释：获取单个产品详情
export function getProductById(id) {
  return http(`${WC_STORE_BASE}/products/${id}`);
}
