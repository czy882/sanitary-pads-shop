import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, Loader2, X } from "lucide-react";
import Button from "../../components/Button";
import { getProductById } from "../../services/storeApi";
import { useCart } from "../../store/cartStore";

// 中文注释：去除 HTML（用于短简介展示，避免直接渲染 HTML）
const stripHtml = (html) => (html ? html.replace(/<[^>]*>?/gm, "") : "");

// 中文注释：把 Store API 的价格（通常是 cents）转成展示用金额
const formatPrice = (product) => {
  // Woo Store API: product.prices.price 通常是以分为单位（cents）
  const cents = product?.prices?.price;
  if (cents === undefined || cents === null || cents === "") return "";
  const n = Number(cents);
  if (Number.isNaN(n)) return "";
  return `$${(n / 100).toFixed(2)}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addItem, loading: cartLoading } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  // 中文注释：图片索引与数量
  const [activeIndex, setActiveIndex] = useState(0);

  // 中文注释：数量选择（加入购物车时使用）
  const [qty, setQty] = useState(1);

  // 中文注释：Lightbox 状态
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const overlayRef = useRef(null);

  // 1) 拉取产品数据
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProductById(id);
        setProduct(data);

        // 中文注释：新产品进来时重置索引与数量
        setActiveIndex(0);
        setQty(1);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 2) 计算图片数组
  const images = useMemo(() => {
    const arr = product?.images;
    if (Array.isArray(arr) && arr.length > 0) return arr;
    // 中文注释：如果没有图片，给一个占位
    return [{ src: "https://placehold.co/1200x1600/f8f6f4/7c2b3d?text=No+Image", alt: "No image" }];
  }, [product]);

  const activeImage = images[Math.min(activeIndex, images.length - 1)];

  // 3) 上一张 / 下一张
  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  // 4) Lightbox 键盘操作（← → ESC）
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

  // 5) 点 overlay 关闭（点到内容不关闭）
  const onOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) setLightboxOpen(false);
  };

  // 6) 加入购物车
  const handleAddToCart = async () => {
    // 中文注释：Store API 产品必须有数值型 id
    const rawId = product?.id;
    const productId = Number(rawId);
    if (!productId || Number.isNaN(productId)) {
      console.warn("[AddToCart] Missing/invalid product id:", rawId);
      return;
    }

    const safeQty = Math.max(1, Number(qty) || 1);

    // 中文注释：不同实现的 cartStore 可能接收 (id, qty) 或 ({ id, quantity })
    // 为了避免后端报 Missing parameter(s): id，这里优先传对象格式：{ id, quantity }
    try {
      await addItem({ id: productId, quantity: safeQty });
    } catch (err) {
      // 中文注释：兼容旧签名 addItem(productId, qty)
      try {
        await addItem(productId, safeQty);
      } catch (err2) {
        console.error("[AddToCart] Failed:", err2);
        throw err2;
      }

      // 中文注释：如果旧签名成功，这里不再抛错
      console.warn("[AddToCart] Fallback signature used due to:", err);
    }
  };

  // 7) 加减数量
  const decQty = () => setQty((v) => Math.max(1, (Number(v) || 1) - 1));
  const incQty = () => setQty((v) => Math.min(99, (Number(v) || 1) + 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f4] pt-32 flex justify-center">
        <Loader2 className="animate-spin text-[#7c2b3d]" size={42} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f8f6f4] pt-32 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-[#9a8a85] text-sm mb-8 flex items-center hover:text-[#7c2b3d] transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>

          <div className="bg-white rounded-[2.5rem] p-8 border border-[#f0e8e4] text-red-500">
            {error || "Product not found."}
          </div>
        </div>
      </div>
    );
  }

  const title = product?.name || "Product";
  const price = formatPrice(product);
  const intro = stripHtml(product?.short_description || product?.description);

  return (
    <div className="min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f]">
      <div className="max-w-[1400px] mx-auto pt-24 md:pt-32 px-6 pb-20">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-[#9a8a85] text-sm mb-8 flex items-center hover:text-[#7c2b3d] transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ===================== 左侧：图片区域 ===================== */}
          <div>
            <div className="bg-white rounded-[2.5rem] border border-[#f0e8e4] shadow-sm overflow-hidden">
              {/* 图片容器 */}
              <div className="relative aspect-4/5 bg-[#f9f9f9] flex items-center justify-center">
                {/* 左右 hover 区域（你说的“光标放到左/右切换”） */}
                <div
                  className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-w-resize"
                  onMouseEnter={() => images.length > 1 && goPrev()}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-e-resize"
                  onMouseEnter={() => images.length > 1 && goNext()}
                  aria-hidden="true"
                />

                {/* 图片本体：点击打开 Lightbox */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="relative z-0 w-full h-full flex items-center justify-center"
                  aria-label="Open image"
                >
                  <img
                    src={activeImage?.src}
                    alt={activeImage?.alt || title}
                    className="w-full h-full object-contain mix-blend-multiply p-10"
                    draggable="false"
                  />
                </button>

                {/* 左右按钮（视觉明确） */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#f0e8e4] shadow-sm flex items-center justify-center text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#f0e8e4] shadow-sm flex items-center justify-center text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* 点点指示器 */}
              {images.length > 1 && (
                <div className="px-8 py-6 flex items-center justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === activeIndex ? "bg-[#7c2b3d] scale-110" : "bg-[#e5d5d0] hover:bg-[#cdb6b0]"
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ===================== 右侧：信息区域 ===================== */}
          <div className="flex flex-col">
            <div className="mb-10">
              {/* 分类（可选） */}
              {product?.categories?.[0]?.name && (
                <div className="text-[#7c2b3d] font-bold tracking-[0.2em] uppercase text-xs mb-4">
                  {product.categories[0].name}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4">
                {title}
              </h1>

              {price && (
                <div className="text-2xl font-medium text-[#7c2b3d] mb-6">
                  {price}
                </div>
              )}

              <p className="text-[#6e6e73] font-light leading-relaxed">
                {intro}
              </p>
            </div>

            {/* 数量 + 加入购物车 */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#f0e8e4] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-[#9a8a85]">Quantity</div>

                <div className="flex items-center gap-4 bg-[#f8f6f4] rounded-full px-4 py-2 border border-[#efe6e4]">
                  <button
                    type="button"
                    onClick={decQty}
                    disabled={qty <= 1}
                    className="text-[#1d1d1f] hover:text-[#7c2b3d] disabled:opacity-30 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-medium text-sm w-6 text-center">{qty}</span>

                  <button
                    type="button"
                    onClick={incQty}
                    className="text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg shadow-xl shadow-[#7c2b3d]/20"
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                {cartLoading ? (
                  <span className="inline-flex items-center gap-2">
                    Adding <Loader2 className="animate-spin" size={18} />
                  </span>
                ) : (
                  "Add to Bag"
                )}
              </Button>

              <div className="mt-4 text-xs text-[#9a8a85]">
                Complimentary shipping on orders over $50.
              </div>
            </div>

            {/* 详情扩展（可选：你未来可以换成折叠面板） */}
            {stripHtml(product?.description) && (
              <div className="mt-10">
                <h3 className="text-lg font-serif font-medium mb-3">Details</h3>
                <p className="text-[#6e6e73] font-light leading-relaxed">
                  {stripHtml(product.description)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== Lightbox ===================== */}
      {lightboxOpen && (
        <div
          ref={overlayRef}
          onMouseDown={onOverlayMouseDown}
          className="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div className="relative w-full max-w-5xl bg-[#0b0b0c]/30 rounded-3xl border border-white/10 overflow-hidden">
            {/* 关闭按钮 */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-[#1d1d1f]" />
            </button>

            {/* 图片 */}
            <div className="relative w-full aspect-16/10 flex items-center justify-center">
              <img
                src={activeImage?.src}
                alt={activeImage?.alt || title}
                className="max-w-full max-h-full object-contain"
                draggable="false"
              />

              {/* 左右按钮 */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} className="text-[#1d1d1f]" />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} className="text-[#1d1d1f]" />
                  </button>
                </>
              )}
            </div>

            {/* 点点 */}
            {images.length > 1 && (
              <div className="px-6 py-5 flex justify-center gap-2 bg-black/20">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === activeIndex ? "bg-white scale-110" : "bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;