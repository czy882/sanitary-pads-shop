// src/pages/DayComfort.jsx
import React, { useEffect, useMemo, useState } from "react";
import Reveal from "../../components/Reveal";
import { fetchProductBySlug } from "../../lib/wpProducts";

// ✅ 改成你 Woo 后台 DayComfort 的真实 slug
const DAY_COMFORT_SLUG = "day-comfort";

export default function DayComfort() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchProductBySlug(DAY_COMFORT_SLUG)
      .then((p) => mounted && setProduct(p))
      .catch(() => mounted && setProduct(null));
    return () => {
      mounted = false;
    };
  }, []);

  const buyUrl = useMemo(() => {
    // ✅ 最稳：直接跳 Woo 原生产品购买页
    // 如果没拉到，就用 fallback（也能先跑起来）
    return product?.permalink || `https://estora.au/product/${DAY_COMFORT_SLUG}/`;
  }, [product]);

  return (
    <div className="bg-[#f8f6f4] text-[#1d1d1f]">
      {/* 0. PageShell / 页面壳与全局节奏 */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* 1. HeroIntro / 首屏产品宣言 */}
        <section className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal>
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
                  DayComfort
                </h1>

                <p className="text-lg md:text-xl leading-relaxed text-[#1d1d1f]/80 max-w-[42ch]">
                  {/* Copy Placeholder：一句克制的高端宣言 */}
                  日用舒适的重新定义。更轻、更透气、更贴合。
                </p>

                <div className="flex items-center gap-3 pt-2">
                  {/* ✅ 去购买（联动 Woo 产品 permalink） */}
                  <a
                    href={buyUrl}
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium
                               bg-[#7c2b3d] text-white hover:opacity-90 transition"
                  >
                    去购买 DayComfort
                  </a>

                  <a
                    href="#section-a"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium
                               border border-[#1d1d1f]/20 hover:border-[#1d1d1f]/40 transition"
                  >
                    了解更多
                  </a>
                </div>

                {/* Price Placeholder（可选） */}
                {product?.price ? (
                  <p className="text-sm text-[#1d1d1f]/60">价格：{product.price}</p>
                ) : (
                  <p className="text-sm text-[#1d1d1f]/50">价格占位（从 Woo 拉取）</p>
                )}
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <div className="w-full">
                <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                  {/* HeroImage Placeholder：产品主视觉大图 */}
                  <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                    Hero Image Placeholder（产品主视觉）
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 2. OneLinePromise / 一句话核心价值 */}
        <section className="py-14 md:py-20 border-t border-[#1d1d1f]/10">
          <Reveal>
            <div className="max-w-[900px]">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                {/* Placeholder：一行大标题 */}
                轻到几乎忘记它的存在。
              </h2>
              <p className="mt-5 text-base md:text-lg text-[#1d1d1f]/70 max-w-[60ch] leading-relaxed">
                {/* Placeholder：解释 1-2 句话 */}
                为日常节奏而生：让舒适、透气与贴合成为默认体验。
              </p>
            </div>
          </Reveal>
        </section>

        {/* 3. FeatureSectionA / 核心卖点 A：触感与透气（大图段落） */}
        <section id="section-a" className="py-16 md:py-24">
          <Reveal>
            <div className="space-y-6 max-w-[760px]">
              <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
                像肌肤一样呼吸
              </h3>
              <p className="text-base md:text-lg text-[#1d1d1f]/70 leading-relaxed">
                {/* Placeholder：2-3 句体感解释 */}
                柔软触感与轻盈透气并存，减少闷感，让每一次日常都更从容。
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={120} className="mt-10 md:mt-14">
            <div className="aspect-[16/9] rounded-2xl bg-black/5 overflow-hidden">
              {/* Image Placeholder：材质微距/表层细节大图 */}
              <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                Image Placeholder（材质微距 / 表层细节）
              </div>
            </div>
          </Reveal>
        </section>

        {/* 4. FeatureSectionB / 核心卖点 B：贴合与稳定（两栏） */}
        <section className="py-16 md:py-24 border-t border-[#1d1d1f]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal>
              <div className="space-y-5">
                <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
                  贴合身形，步伐依旧轻盈
                </h3>

                <ul className="space-y-3 text-base md:text-lg text-[#1d1d1f]/70">
                  {/* Placeholder：短 bullet，不超过 12 字 */}
                  <li>• 稳定贴合不移位</li>
                  <li>• 轻薄不束缚</li>
                  <li>• 日常动作更自在</li>
                </ul>

                <p className="text-sm text-[#1d1d1f]/55">
                  {/* Placeholder：小字补充 */}
                  说明占位：结构/工艺带来的体验原因。
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                {/* Image Placeholder：结构示意/贴合概念图 */}
                <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                  Image Placeholder（结构示意 / 贴合概念图）
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 5. FeatureSectionC / 干爽与清爽感（大图 + 文本） */}
        <section className="py-16 md:py-24">
          <Reveal>
            <div className="space-y-6 max-w-[760px]">
              <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
                干爽，不是吸收后的沉重
              </h3>
              <p className="text-base md:text-lg text-[#1d1d1f]/70 leading-relaxed">
                {/* Placeholder：2-3 句 */}
                日用体验的关键，是持续的清爽感与轻盈感，而不是“吸收后变厚”的存在感。
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={120} className="mt-10 md:mt-14">
            <div className="aspect-[16/9] rounded-2xl bg-black/5 overflow-hidden">
              {/* Image Placeholder：抽象光影/概念图 */}
              <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                Image Placeholder（干爽概念图 / 高级光影）
              </div>
            </div>
          </Reveal>
        </section>

        {/* 6. DesignDetails / 细节设计（纵向清单） */}
        <section className="py-16 md:py-24 border-t border-[#1d1d1f]/10">
          <Reveal>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
              细节，决定体感
            </h3>
            <p className="mt-4 text-base md:text-lg text-[#1d1d1f]/70 max-w-[70ch] leading-relaxed">
              {/* Placeholder */}
              我们把关键体验拆成可感知的细节：边缘、表层、贴合与透气，每一处都更克制。
            </p>
          </Reveal>

          <div className="mt-10 md:mt-14 space-y-10">
            {/* Detail Item 1 */}
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <h4 className="text-xl md:text-2xl font-semibold">
                    细节标题 1（占位）
                  </h4>
                  <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                    细节描述 1（占位）
                  </p>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                    Detail Image 1 Placeholder
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Detail Item 2 */}
            <Reveal delayMs={60}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <h4 className="text-xl md:text-2xl font-semibold">
                    细节标题 2（占位）
                  </h4>
                  <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                    细节描述 2（占位）
                  </p>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                    Detail Image 2 Placeholder
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Detail Item 3 */}
            <Reveal delayMs={120}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <h4 className="text-xl md:text-2xl font-semibold">
                    细节标题 3（占位）
                  </h4>
                  <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                    细节描述 3（占位）
                  </p>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                    Detail Image 3 Placeholder
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. HowItFitsYourDay / 场景化的一天（纵向三段） */}
        <section className="py-16 md:py-24">
          <Reveal>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
              为日常节奏而生
            </h3>
          </Reveal>

          <div className="mt-10 md:mt-14 space-y-10">
            <Reveal>
              <div className="space-y-2">
                <h4 className="text-xl md:text-2xl font-semibold">场景 1（占位）</h4>
                <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                  体感一句话（占位）+ 功能解释一句话（占位）
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={60}>
              <div className="space-y-2">
                <h4 className="text-xl md:text-2xl font-semibold">场景 2（占位）</h4>
                <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                  体感一句话（占位）+ 功能解释一句话（占位）
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <div className="space-y-2">
                <h4 className="text-xl md:text-2xl font-semibold">场景 3（占位）</h4>
                <p className="text-base text-[#1d1d1f]/70 leading-relaxed">
                  体感一句话（占位）+ 功能解释一句话（占位）
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={180}>
              <div className="aspect-[16/9] rounded-2xl bg-black/5 overflow-hidden">
                {/* Image Placeholder：整体场景图 */}
                <div className="h-full w-full flex items-center justify-center text-sm text-[#1d1d1f]/50">
                  Scene Image Placeholder（整体场景图）
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 8. QuickCompare / 静态对比表（不滑动、不卡片） */}
        <section className="py-16 md:py-24 border-t border-[#1d1d1f]/10">
          <Reveal>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
              你适合 DayComfort 还是其他款？
            </h3>
            <p className="mt-4 text-base md:text-lg text-[#1d1d1f]/70 max-w-[70ch] leading-relaxed">
              {/* Placeholder */}
              对比占位：用最少的字，让用户一眼选对。
            </p>
          </Reveal>

          <Reveal delayMs={120} className="mt-10 md:mt-14">
            <div className="rounded-2xl border border-[#1d1d1f]/10 bg-white/40 overflow-hidden">
              <div className="grid grid-cols-4 text-sm md:text-base">
                <div className="p-5 font-semibold">DayComfort</div>
                <div className="p-5 font-semibold">Night</div>
                <div className="p-5 font-semibold">Overnight</div>
                <div className="p-5 font-semibold">Liners</div>

                <div className="p-5 text-[#1d1d1f]/70">轻薄 / 透气（占位）</div>
                <div className="p-5 text-[#1d1d1f]/70">更长 / 夜用（占位）</div>
                <div className="p-5 text-[#1d1d1f]/70">更强 / 量多（占位）</div>
                <div className="p-5 text-[#1d1d1f]/70">更轻 / 日常（占位）</div>

                <div className="p-5 text-[#1d1d1f]/70">通勤 / 工作（占位）</div>
                <div className="p-5 text-[#1d1d1f]/70">夜晚安心（占位）</div>
                <div className="p-5 text-[#1d1d1f]/70">整夜防护（占位）</div>
                <div className="p-5 text-[#1d1d1f]/70">日常维护（占位）</div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 9. SpecsAccordion / 规格折叠 */}
        <section className="py-16 md:py-24">
          <Reveal>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">规格</h3>
          </Reveal>

          <div className="mt-8 space-y-3">
            <Reveal>
              <details className="rounded-2xl border border-[#1d1d1f]/10 bg-white/40 p-5">
                <summary className="cursor-pointer font-semibold">尺寸 / 长度（占位）</summary>
                <p className="mt-3 text-[#1d1d1f]/70">内容占位</p>
              </details>
            </Reveal>

            <Reveal delayMs={60}>
              <details className="rounded-2xl border border-[#1d1d1f]/10 bg-white/40 p-5">
                <summary className="cursor-pointer font-semibold">吸收等级（占位）</summary>
                <p className="mt-3 text-[#1d1d1f]/70">内容占位</p>
              </details>
            </Reveal>

            <Reveal delayMs={120}>
              <details className="rounded-2xl border border-[#1d1d1f]/10 bg-white/40 p-5">
                <summary className="cursor-pointer font-semibold">材质结构（占位）</summary>
                <p className="mt-3 text-[#1d1d1f]/70">内容占位</p>
              </details>
            </Reveal>
          </div>
        </section>

        {/* 10. TrustAssurance / 安心承诺 */}
        <section className="py-16 md:py-24 border-t border-[#1d1d1f]/10">
          <Reveal>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
              安心使用的理由
            </h3>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal>
              <div className="rounded-2xl bg-white/40 border border-[#1d1d1f]/10 p-6">
                <div className="text-lg font-semibold">承诺 1（占位）</div>
                <p className="mt-3 text-[#1d1d1f]/70">说明占位</p>
              </div>
            </Reveal>

            <Reveal delayMs={60}>
              <div className="rounded-2xl bg-white/40 border border-[#1d1d1f]/10 p-6">
                <div className="text-lg font-semibold">承诺 2（占位）</div>
                <p className="mt-3 text-[#1d1d1f]/70">说明占位</p>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <div className="rounded-2xl bg-white/40 border border-[#1d1d1f]/10 p-6">
                <div className="text-lg font-semibold">承诺 3（占位）</div>
                <p className="mt-3 text-[#1d1d1f]/70">说明占位</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 11. FinalPurchase / 底部购买召回（再次联动 Woo 产品页） */}
        <section className="py-16 md:py-24">
          <Reveal>
            <div className="rounded-3xl border border-[#1d1d1f]/10 bg-white/50 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-semibold">DayComfort</div>
                <div className="text-[#1d1d1f]/70">日用舒适与透气的理想平衡。</div>
                <div className="text-sm text-[#1d1d1f]/55">
                  {product?.price ? `价格：${product.price}` : "价格占位（从 Woo 拉取）"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={buyUrl}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium
                             bg-[#7c2b3d] text-white hover:opacity-90 transition"
                >
                  去购买
                </a>

                {/* 这个 /cart 取决于你的路由。如果你没有 cart 页面就先删掉 */}
                <a
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium
                             border border-[#1d1d1f]/20 hover:border-[#1d1d1f]/40 transition"
                >
                  查看购物车
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}