import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import Button from "../components/Button";

// ✅ 改用 REST 数据层
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../store/cartStore";

// --- 动画辅助组件 (保持不变) ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  // ✅ 通过 Woo Store API 获取最新 4 个产品（真实来自 Woo 后台 products）
  const { products, loading, error } = useProducts({
    per_page: 4,
    orderby: "menu_order",
    order: "asc",
  });

  // ✅ CoCart 购物车操作
  const { addItem, loading: cartLoading } = useCart();

  // 辅助函数：处理描述文本（去除 HTML 标签）
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  // 中文注释：将 Store API 返回的价格格式化为 $xx.xx（不同站点返回结构可能略有差异）
  const formatPrice = (p) => {
    // Store API 常见：p.prices.price（可能是字符串/数字/分）
    const raw =
      p?.prices?.price ??
      p?.prices?.regular_price ??
      p?.price ??
      "";

    // 如果是类似 "1290"（分），你可以在这里按需 /100
    // 这里先做最保守显示：如果是数字字符串且没有小数，按原样显示
    if (raw === "" || raw === null || raw === undefined) return "";

    // raw 可能是 "12.90" / 12.9 / "1290"
    const str = String(raw);
    // 如果后端返回已经带货币符号，就直接返回
    if (str.includes("$") || str.includes("A$")) return str;

    // 尝试转成数字
    const num = Number(str);
    if (Number.isNaN(num)) return str;

    // 默认显示澳币符号（你也可以换成 A$）
    return `$${num.toFixed(2)}`;
  };

  // 中文注释：图片兜底
  const getImage = (p) => p?.images?.[0]?.src;

  return (
    <div className="bg-[#f8f6f4] text-[#1d1d1f] min-h-screen font-sans selection:bg-[#7c2b3d] selection:text-white">
      {/* === Hero Section (保持不变) === */}
      <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-28 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* 左侧文案 */}
            <div className="lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
              <FadeIn>
                <div className="inline-block mb-6 px-4 py-1.5 border border-[#7c2b3d] rounded-full text-[11px] font-bold tracking-[0.2em] text-[#7c2b3d] uppercase bg-white/50 backdrop-blur-sm">
                  Global Exclusive Patent
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight mb-8 text-[#7c2b3d] leading-[1.1]">
                  The luxury of <br /> <span className="italic">100% Silk.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={400}>
                <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Discover the world's first sanitary pad with a 100% natural
                  mulberry silk top sheet. <strong> 99% antibacterial</strong>,
                  nourishing with 18 amino acids, and breathable like a second
                  skin.
                </p>
              </FadeIn>

              <FadeIn delay={600}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    variant="primary"
                    size="lg"
                    className="h-14 px-8 text-lg shadow-xl shadow-[#7c2b3d]/20"
                    onClick={() => navigate("/products")}
                  >
                    Shop the Collection
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-[#7c2b3d] hover:text-[#5a1e2b] h-14 text-lg"
                  >
                    Our Technology <ChevronRight size={18} />
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* 右侧主图 */}
            <div className="lg:w-1/2 w-full relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <FadeIn delay={200} className="w-full max-w-[600px] aspect-4/5 lg:aspect-square relative">
                <div className="absolute inset-0 bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(124,43,61,0.1)] overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                  <img
                    src="https://placehold.co/1000x1000/ffffff/7c2b3d?text=AURORA+Hero"
                    alt="AURORA Collection"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* 背景光晕 */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-linear-to-b from-[#efe6e4] to-transparent rounded-full blur-[120px] z-0 opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-linear-to-t from-white to-transparent rounded-full blur-[100px] z-0 opacity-80 pointer-events-none"></div>
      </section>

      {/* === Value Proposition (保持不变) === */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h3 className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-16 text-center text-[#1d1d1f]">
              Why your skin deserves silk.
            </h3>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* 你原本的 3 个卡片保持不变 */}
            {/* ...（略）... */}
          </div>
        </div>
      </section>

      {/* === Made for You Section (动态产品列表 - 已对接 Woo Store API) === */}
      <section className="py-24 px-6 bg-[#f8f6f4]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <FadeIn>
              <h3 className="text-4xl font-serif font-medium text-[#1d1d1f] mb-4">
                Care for every cycle.
              </h3>
              <p className="text-gray-500 text-lg font-light">
                Premium protection, from light flow to heavy nights.
              </p>
            </FadeIn>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#7c2b3d]" size={48} />
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div className="text-center text-red-500 py-10">
              Failed to load products. Please check your connection.
            </div>
          )}

          {/* 渲染 REST 数据 */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product, index) => (
                <FadeIn key={product.id} delay={index * 150} className="h-full">
                  <div
                    onClick={() => navigate("/products")}
                    className="group cursor-pointer flex flex-col h-full"
                  >
                    <div className="bg-white rounded-[2.5rem] p-8 mb-6 relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_15px_40px_-15px_rgba(124,43,61,0.1)] transform group-hover:-translate-y-1">
                      <div className="aspect-3/4 flex items-center justify-center mb-4 relative z-10">
                        <img
                          src={
                            getImage(product) ||
                            "https://placehold.co/600x800/f8f6f4/7c2b3d?text=No+Image"
                          }
                          alt={product.name}
                          className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                        />
                      </div>

                      {/* Quick Add：直接加购（阻止卡片点击跳转） */}
                      <div className="absolute bottom-6 left-0 w-full flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                        <Button
                          size="sm"
                          className="shadow-lg bg-[#7c2b3d] text-white hover:bg-[#5a1e2b] border-none"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product.id, 1);
                          }}
                          disabled={cartLoading}
                        >
                          Quick Add
                        </Button>
                      </div>
                    </div>

                    <div className="text-center px-2">
                      <h4 className="text-xl font-medium text-[#1d1d1f] mb-1 font-serif group-hover:text-[#7c2b3d] transition-colors duration-300">
                        {product.name}
                      </h4>

                      <p className="text-sm text-gray-500 mb-2 font-light line-clamp-2">
                        {stripHtml(product.short_description)}
                      </p>

                      <p className="text-base font-medium text-[#1d1d1f]">
                        {formatPrice(product)}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === Trust Indicators (保持不变) === */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          {[
            "Global Exclusive Patent",
            "100% Mulberry Silk",
            "0 Fluorescent Agents",
            "0 Bleach",
            "28-Day Biodegradable",
          ].map((text, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="flex items-center gap-2 text-gray-400 font-medium uppercase tracking-wider text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7c2b3d]"></span>
                {text}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
