import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Star, Maximize, Moon } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { fetchProductBySlug } from '../../lib/wpProducts';

// --- 动画辅助组件：FadeIn（与 DayComfort / NightSanctuary 一致：淡入上浮、一次触发） ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.12 }
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
      className={[
        'transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ✅ 改成你 Woo 后台 Overnight Protection 的真实 slug
const OVERNIGHT_SLUG = 'overnight-protection';

const OvernightProtection = () => {
  // 本地产品数据（用于图/标题占位；后续你也可以完全替换为 API 数据）
  const product = PRODUCTS.find(p => p.id === 3);
  const [wooProduct, setWooProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchProductBySlug(OVERNIGHT_SLUG)
      .then(p => mounted && setWooProduct(p))
      .catch(() => mounted && setWooProduct(null));

    return () => {
      mounted = false;
    };
  }, []);

  const buyUrl = useMemo(() => {
    return wooProduct?.permalink || `https://estora.au/product/${OVERNIGHT_SLUG}/`;
  }, [wooProduct]);

  if (!product) return <div className="pt-32 text-center">Product data missing</div>;

  return (
    <div className="bg-[#f8f6f4] min-h-screen font-sans text-[#1d1d1f]">
      {/* 0. PageShell / 页面壳与全局节奏 */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">

        {/* 1. HeroIntro / 首屏产品宣言（Apple-style：两栏 + 大留白） */}
        <section className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            <FadeIn>
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight">
                  {product.name}
                </h1>

                <p className="text-lg md:text-xl leading-relaxed text-[#1d1d1f]/80 max-w-[44ch] flex items-center gap-2">
                  <Star size={18} className="text-[#7c2b3d] fill-[#7c2b3d]" />
                  {/* Copy Placeholder：一句克制的高端极致防护宣言 */}
                  {product.tagline || 'Maximum coverage, effortlessly refined.'}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  {/* ✅ 去购买（联动 Woo 产品 permalink） */}
                  <a
                    href={buyUrl}
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-[#7c2b3d] text-white hover:opacity-90 transition"
                  >
                    去购买 Overnight Protection
                  </a>

                  <a
                    href="#section-a"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium border border-[#1d1d1f]/20 hover:border-[#1d1d1f]/40 transition"
                  >
                    了解更多
                  </a>
                </div>

                {/* Price Placeholder（可选） */}
                <p className="text-sm text-[#1d1d1f]/55">
                  {wooProduct?.price ? `价格：${wooProduct.price}` : `价格占位：$${product.price}`}
                  <span className="ml-2 text-[#1d1d1f]/35">GST Included</span>
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="w-full">
                <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden flex items-center justify-center">
                  {/* HeroImage Placeholder：极致防护主视觉（可用 product.image 或换为更高级棚拍） */}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-3/4 h-3/4 object-contain drop-shadow-2xl"
                    />
                  ) : (
                    <div className="text-sm text-[#1d1d1f]/50">Hero Image Placeholder（极致防护主视觉）</div>
                  )}
                </div>
              </div>
            </FadeIn>

          </div>
        </section>

        {/* 2. OneLinePromise / 一句话核心价值 */}
        <section className="py-14 md:py-20 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <div className="max-w-[900px]">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                {/* Placeholder：一行大标题 */}
                最大覆盖，给最安心的夜。
              </h2>
              <p className="mt-5 text-base md:text-lg text-[#1d1d1f]/70 max-w-[62ch] leading-relaxed">
                {/* Placeholder：解释 1-2 句话 */}
                为量多与长时佩戴而设计，把安全感做得更轻、更稳、更从容。
              </p>
            </div>
          </FadeIn>
        </section>

        {/* 3. FeatureSectionA / 卖点 A：350mm 最大覆盖（大图段落） */}
        <section id="section-a" className="py-16 md:py-24">
          <FadeIn>
            <div className="space-y-6 max-w-[760px]">
              <h3 className="text-2xl md:text-4xl font-semibold tracking-tight flex items-center gap-2">
                <Maximize size={22} className="text-[#7c2b3d]" />
                350mm 最大覆盖
              </h3>
              <p className="text-base md:text-lg text-[#1d1d1f]/70 leading-relaxed">
                {/* Placeholder：2-3 句 */}
                睡姿怎么变，都能保持稳定防护。延长长度与更大后部覆盖，让安全感更可控。
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={120} className="mt-10 md:mt-14">
            <div className="aspect-[16/9] rounded-2xl bg-black/5 overflow-hidden">
              {/* Image Placeholder：350mm 长度 / 覆盖范围示意 / 夜用氛围大图 */}
              <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                Image Placeholder（350mm 长度 / 覆盖范围示意 / 夜用氛围）
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 4. FeatureSectionB / 卖点 B：吸收与锁定（两栏，不滑动） */}
        <section className="py-16 md:py-24 border-t border-[#1d1d1f]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <FadeIn>
              <div className="space-y-5">
                <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
                  快速吸收，稳定锁定
                </h3>

                <ul className="space-y-3 text-base md:text-lg text-[#1d1d1f]/70">
                  {/* Placeholder：短 bullet */}
                  <li>• 迅速吸收不回渗</li>
                  <li>• 高强度时刻更安心</li>
                  <li>• 触感更轻盈不厚重</li>
                </ul>

                <p className="text-sm text-[#1d1d1f]/55">
                  {/* Placeholder */}
                  说明占位：核心结构如何实现“吸收 + 锁定”。
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                {/* Image Placeholder：吸收核心结构示意 */}
                <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                  Image Placeholder（吸收核心 / 锁定示意）
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 5. FeatureSectionC / 卖点 C：丝感夜间触感（大图 + 文本） */}
        <section className="py-16 md:py-24">
          <FadeIn>
            <div className="space-y-6 max-w-[760px]">
              <h3 className="text-2xl md:text-4xl font-semibold tracking-tight flex items-center gap-2">
                <Moon size={22} className="text-[#7c2b3d]" />
                长时佩戴，也依旧温和
              </h3>
              <p className="text-base md:text-lg text-[#1d1d1f]/70 leading-relaxed">
                {/* Placeholder */}
                夜间长时间接触更需要温和触感。我们把透气、干爽与贴合融在同一套体验里，让你睡得更踏实。
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={120} className="mt-10 md:mt-14">
            <div className="aspect-[16/9] rounded-2xl bg-black/5 overflow-hidden">
              {/* Image Placeholder：丝感触感 / 舒缓氛围图 */}
              <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                Image Placeholder（丝感触感 / 舒缓氛围）
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 6. DesignDetails / 细节（纵向清单，不做图集滑动） */}
        <section className="py-16 md:py-24 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">细节，决定极致防护</h3>
            <p className="mt-4 text-base md:text-lg text-[#1d1d1f]/70 max-w-[70ch] leading-relaxed">
              {/* Placeholder */}
              把“最大覆盖”的体验拆成可感知细节：长度、后部覆盖、边缘与核心。
            </p>
          </FadeIn>

          <div className="mt-10 md:mt-14 space-y-10">
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <h4 className="text-xl md:text-2xl font-semibold">细节标题 1（占位）</h4>
                  <p className="text-base text-[#1d1d1f]/70 leading-relaxed">细节描述 1（占位）</p>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                    Detail Image 1 Placeholder
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={60}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <h4 className="text-xl md:text-2xl font-semibold">细节标题 2（占位）</h4>
                  <p className="text-base text-[#1d1d1f]/70 leading-relaxed">细节描述 2（占位）</p>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                    Detail Image 2 Placeholder
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <h4 className="text-xl md:text-2xl font-semibold">细节标题 3（占位）</h4>
                  <p className="text-base text-[#1d1d1f]/70 leading-relaxed">细节描述 3（占位）</p>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                    Detail Image 3 Placeholder
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 7. HowItFitsYourNight / 夜间场景（三段纵向） */}
        <section className="py-16 md:py-24">
          <FadeIn>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">为最重的夜而生</h3>
          </FadeIn>

          <div className="mt-10 md:mt-14 space-y-10">
            <FadeIn>
              <div className="space-y-2">
                <h4 className="text-xl md:text-2xl font-semibold">场景 1（占位）</h4>
                <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                  体感一句话（占位）+ 功能解释一句话（占位）
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={60}>
              <div className="space-y-2">
                <h4 className="text-xl md:text-2xl font-semibold">场景 2（占位）</h4>
                <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                  体感一句话（占位）+ 功能解释一句话（占位）
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="space-y-2">
                <h4 className="text-xl md:text-2xl font-semibold">场景 3（占位）</h4>
                <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                  体感一句话（占位）+ 功能解释一句话（占位）
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={180}>
              <div className="aspect-[16/9] rounded-2xl bg-black/5 overflow-hidden">
                <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                  Scene Image Placeholder（夜间整体场景图）
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 8. SpecsAccordion / 规格折叠 */}
        <section className="py-16 md:py-24 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">规格</h3>
          </FadeIn>

          <div className="mt-8 space-y-3">
            <FadeIn>
              <details className="rounded-2xl border border-[#1d1d1f]/10 bg-white/40 p-5">
                <summary className="cursor-pointer font-semibold">长度 / 尺寸（占位）</summary>
                <p className="mt-3 text-[#1d1d1f]/70">内容占位（可用：{product.specs?.[0] || '350mm'}）</p>
              </details>
            </FadeIn>

            <FadeIn delay={60}>
              <details className="rounded-2xl border border-[#1d1d1f]/10 bg-white/40 p-5">
                <summary className="cursor-pointer font-semibold">吸收等级（占位）</summary>
                <p className="mt-3 text-[#1d1d1f]/70">内容占位（Maximum / Heavy Flow）</p>
              </details>
            </FadeIn>

            <FadeIn delay={120}>
              <details className="rounded-2xl border border-[#1d1d1f]/10 bg-white/40 p-5">
                <summary className="cursor-pointer font-semibold">材质结构（占位）</summary>
                <p className="mt-3 text-[#1d1d1f]/70">内容占位</p>
              </details>
            </FadeIn>
          </div>
        </section>

        {/* 9. TrustAssurance / 安心承诺（克制三条） */}
        <section className="py-16 md:py-24">
          <FadeIn>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">安心使用的理由</h3>
          </FadeIn>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn>
              <div className="rounded-2xl bg-white/40 border border-[#1d1d1f]/10 p-6">
                <div className="text-lg font-semibold">承诺 1（占位）</div>
                <p className="mt-3 text-[#1d1d1f]/70">说明占位</p>
              </div>
            </FadeIn>

            <FadeIn delay={60}>
              <div className="rounded-2xl bg-white/40 border border-[#1d1d1f]/10 p-6">
                <div className="text-lg font-semibold">承诺 2（占位）</div>
                <p className="mt-3 text-[#1d1d1f]/70">说明占位</p>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="rounded-2xl bg-white/40 border border-[#1d1d1f]/10 p-6">
                <div className="text-lg font-semibold">承诺 3（占位）</div>
                <p className="mt-3 text-[#1d1d1f]/70">说明占位</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 10. FinalPurchase / 底部购买召回 */}
        <section className="py-16 md:py-24 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <div className="rounded-3xl border border-[#1d1d1f]/10 bg-white/50 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-semibold">{product.name}</div>
                <div className="text-[#1d1d1f]/70">极致覆盖与安心感的理想平衡。</div>
                <div className="text-sm text-[#1d1d1f]/55">
                  {wooProduct?.price ? `价格：${wooProduct.price}` : `价格占位：$${product.price}`}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={buyUrl}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-[#7c2b3d] text-white hover:opacity-90 transition"
                >
                  去购买
                </a>
                <a
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium border border-[#1d1d1f]/20 hover:border-[#1d1d1f]/40 transition"
                >
                  查看购物车
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

      </div>
    </div>
  );
};

export default OvernightProtection;