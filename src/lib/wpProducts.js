// src/lib/wpProducts.js
// 说明：前端不要直接打 /wc/v3/products（会暴露 key）
// 而是请求你自己的 /api/products 代理（服务端再去请求 WooCommerce）

export async function fetchProductBySlug(slug) {
    const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  
    if (!res.ok) return null;
  
    const data = await res.json();
  
    // 兼容后端返回单个 product 或数组
    const p = Array.isArray(data) ? data?.[0] : data;
    if (!p) return null;
  
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      permalink: p.permalink, // ✅ Woo 原生产品页链接
      price: p.price,
      images: (p.images || []).map((i) => ({
        src: i?.src || i,
        alt: p.name,
      })),
    };
  }