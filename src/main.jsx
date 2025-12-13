import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// 中文注释：购物车全局状态（CoCart）
import { CartProvider } from "./store/cartStore";

// 中文注释：渲染 React 应用
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 中文注释：CartProvider 必须包在最外层，保证 Navbar / Cart / Checkout 都能访问 */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
