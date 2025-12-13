// src/hooks/useProducts.js
// 中文注释：产品列表 Hook（基于 Woo Store API）
// 依赖：src/services/storeApi.js 里的 getProducts()

import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/storeApi";

export function useProducts(options = {}) {
  const params = useMemo(
    () => ({
      per_page: options.per_page ?? 20,
      orderby: options.orderby ?? "menu_order",
      order: options.order ?? "asc",
    }),
    [options.per_page, options.orderby, options.order]
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (signal) => {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts(params, { signal });
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      // 中文注释：Abort 不算错误（切页面/重渲染会触发）
      if (e?.name === "AbortError") return;
      setError(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.per_page, params.orderby, params.order]);

  // 中文注释：提供一个外部调用的刷新方法
  const refetch = () => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  };

  return { products, loading, error, refetch };
}
