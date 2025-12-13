// src/lib/http.js
// 中文注释：统一封装网络请求，集中处理 JSON 解析、错误信息、JWT、cookie（CoCart/Woo 会用到）

// ================================
// WordPress 基址读取（Vite Env）
// ================================
const WP_BASE_RAW = String(
  import.meta.env.VITE_WP_BASE_URL || import.meta.env.VITE_WP_BASE || ""
).trim();
const WP_BASE = WP_BASE_RAW.replace(/\/$/, "");

// ================================
// 基址校验（防止误打 localhost）
// ================================
function assertWpBaseConfigured(path) {
  if (WP_BASE) return;
  if (!path) return;

  const p = String(path);
  const isWpApiPath =
    p.startsWith("/wp-json/") || p === "/wp-json" || p.startsWith("wp-json/");

  if (isWpApiPath) {
    throw new Error(
      `未配置 WordPress 基址：
请在 .env.local 设置
VITE_WP_BASE_URL=https://estora.au

当前读取到：
WP_BASE_RAW='${WP_BASE_RAW || ""}'

注意：修改 .env.local 后必须重启 npm run dev`
    );
  }
}

// ================================
// URL 解析
// ================================
function resolveUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;

  assertWpBaseConfigured(path);

  if (!WP_BASE) return path;
  return `${WP_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ================================
// HTTP 主函数
// ================================
export async function http(path, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    credentials = "include",
    signal,
  } = options;

  const url = resolveUrl(path);

  // ---------- body 处理 ----------
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const hasBody = body !== undefined && body !== null;
  const shouldJson = hasBody && !isFormData && typeof body === "object";
  const finalBody = shouldJson ? JSON.stringify(body) : body;

  // ---------- headers ----------
  const finalHeaders = {
    ...headers,
    ...(shouldJson ? { "Content-Type": "application/json" } : {}),
  };

  // ================================
  // 自动注入 JWT Token（关键修复）
  // ================================
  if (!finalHeaders.Authorization && !finalHeaders.authorization) {
    const token = localStorage.getItem("authToken");
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // 🔎 调试用（确认 token 是否真的带上）
  // console.log("[HTTP]", method, url, finalHeaders.Authorization);

  // ---------- fetch ----------
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: finalBody,
    credentials,
    signal,
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      `Request failed: ${res.status} ${res.statusText}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}