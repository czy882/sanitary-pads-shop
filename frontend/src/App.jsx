import React, { useState, useEffect } from 'react'; // 必须引入 useEffect
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Collections from './pages/products/Collections';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Philosophy from './pages/Philosophy';

// 引入 Supabase Client (假设路径正确)
import { supabase } from './supabaseClient';

// 引入产品页面 
import DayComfort from './pages/products/DayComfort';
import NightSanctuary from './pages/products/NightSanctuary';
import OvernightProtection from './pages/products/OvernightProtection';
import DailyLiners from './pages/products/DailyLiners';

// 引入 Login 和 Signup 组件 
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
// 返回最上面
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [cart, setCart] = useState([]);
  
  // --- 核心修复部分：添加 Auth 状态和监听器 ---
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // 添加加载状态，防止页面在检查Session时渲染
  
  useEffect(() => {
    // 1. 检查初始会话并监听变化
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // 初始检查完成，关闭加载状态
    });

    // 2. 监听用户登录/登出事件
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 清理函数
    return () => subscription.unsubscribe();
  }, []);
  // ---------------------------------------------

  // 添加商品到购物车
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      const addedQuantity = product.quantity || 1; 

      if (exists) {
         return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + addedQuantity } : i);
      }
      return [...prev, { ...product, quantity: addedQuantity }];
    });
  };

  // 更新数量
  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  // 删除购物车商品
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 避免在 Supabase 检查 Session 时渲染组件，防止 'Uncaught Error'
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-xl">
        Loading Application...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 将 session 状态传递给需要它的组件 (例如 MainLayout 或 Profile) */}
        <Route path="/" element={<MainLayout cartCount={cartCount} session={session} />}>
          <Route index element={<Home />} />
          
          {/* --- 产品路由 --- */}
          <Route path="collections" element={<Collections onAddToCart={addToCart} />} />
          <Route path="philosophy" element={<Philosophy onAddToCart={addToCart} />} />
          <Route path="day_comfort" element={<DayComfort onAddToCart={addToCart} />} />
          <Route path="night_sanctuary" element={<NightSanctuary onAddToCart={addToCart} />} />
          <Route path="overnight_protection" element={<OvernightProtection onAddToCart={addToCart} />} />
          <Route path="daily_liners" element={<DailyLiners onAddToCart={addToCart} />} />

          <Route 
            path="cart" 
            element={
              <Cart 
                cart={cart} 
                onUpdateQuantity={updateQuantity} 
                onRemoveFromCart={removeFromCart}
              />
            } 
          />
          
          {/* --- Checkout --- */}
          <Route 
            path="checkout" 
            element={<Checkout cart={cart} />} 
          />

          {/* 将 session 状态传递给 Profile */}
          <Route path="profile" element={<Profile session={session} />} />
          
          {/* 登录和注册路由 (不需要传递 session，它们自己会处理登录逻辑) */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;