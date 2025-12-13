// src/lib/http.js
// 中文注释：统一封装网络请求，集中处理 JSON 解析、错误信息、cookie（CoCart/Woo 会用到）

export async function http(path, options = {}) {
    const {
      method = "GET",
      headers = {},
      body,
      credentials = "include", // 中文注释：带上 cookie，购物车/登录态才会生效
      signal,
    } = options;
  
    const res = await fetch(path, {
      method,
      headers: {
        // 中文注释：默认发送 JSON（GET 不会用到 body）
        "Content-Type": "application/json",
        ...headers,
      },
      body,
      credentials,
      signal,
    });
  
    // 中文注释：先读 text，再尝试解析 JSON，避免空响应导致报错
    const text = await res.text();
    let data = null;
  
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text; // 中文注释：不是 JSON 就返回原始文本
    }
  
    // 中文注释：统一错误抛出，方便 hooks/store 捕获
    if (!res.ok) {
      const message =
        (data && typeof data === "object" && (data.message || data.error)) ||
        `Request failed: ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }
  
    return data;
  }
  