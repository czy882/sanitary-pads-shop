import React from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Button from "../components/Button";

// ✅ 使用 CoCart 全局购物车
import { useCart } from "../store/cartStore";

// --- 动画辅助组件 (保持不变) ---
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <div
    className={`animate-slide-up ${className}`}
    style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: "forwards" }}
  >
    {children}
  </div>
);

// 中文注释：把金额字符串安全转换成数字（兜底）
const toNumber = (v) => {
  if (v === null || v === undefined) return 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

// 中文注释：格式化为 $xx.xx
const money = (v) => `$${toNumber(v).toFixed(2)}`;

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    error,
    refreshCart,
    updateItem,
    clear,
  } = useCart();

  // 中文注释：CoCart 通常返回 cart.items 数组
  const items = cart?.items || [];
  const hasItems = items.length > 0;

  // 中文注释：优先使用后端 totals（最准确），没有就前端计算兜底
  const totalFromServer =
    cart?.totals?.total ??
    cart?.totals?.total_price ??
    cart?.totals?.total_items ??
    null;

  const totalFallback = items.reduce((acc, item) => {
    // CoCart 里 price/line_total 字段可能不一致，这里做宽松兜底
    const line =
      item?.totals?.line_total ??
      item?.totals?.total ??
      item?.line_total ??
      (toNumber(item?.price) * toNumber(item?.quantity));

    return acc + toNumber(line);
  }, 0);

  const total = totalFromServer ? toNumber(totalFromServer) : totalFallback;

  // 中文注释：更新数量（CoCart 用 item_key 标识 cart item）
  const handleChangeQty = async (itemKey, currentQty, delta) => {
    const nextQty = Math.max(1, (currentQty || 1) + delta);
    await updateItem(itemKey, nextQty);
  };

  // 中文注释：移除商品（最通用：quantity=0；如果你的 CoCart 不支持，我再给你切换 remove endpoint）
  const handleRemove = async (itemKey) => {
    await updateItem(itemKey, 0);
    // 有些版本 updateItem(0) 不返回完整 cart，这里保险刷新一次
    await refreshCart();
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-center mb-6 tracking-tight text-[#1d1d1f]">
            Your Shopping Bag
          </h1>
        </FadeIn>

        {/* 顶部提示文案 */}
        {hasItems && (
          <FadeIn delay={100}>
            <p className="text-center text-[#9a8a85] mb-12 font-light">
              Complimentary shipping on all orders over $50.
            </p>
          </FadeIn>
        )}

        {/* 全局 loading（首次拉 cart 或操作中） */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#7c2b3d]" size={32} />
          </div>
        )}

        {/* 全局错误 */}
        {error && (
          <div className="text-center text-red-500 py-6">
            {error}
          </div>
        )}

        {/* 空状态 */}
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <FadeIn delay={200} className="relative mb-8">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
                <ShoppingBag size={64} strokeWidth={1} className="text-[#e5d5d0]" />
              </div>
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#7c2b3d]/10 rounded-full blur-sm"></div>
              <div className="absolute bottom-4 left-2 w-4 h-4 bg-[#7c2b3d]/20 rounded-full blur-sm"></div>
            </FadeIn>

            <FadeIn delay={300} className="text-center">
              <h2 className="text-2xl font-serif text-[#1d1d1f] mb-3">
                Your bag is currently empty
              </h2>
              <p className="text-[#9a8a85] mb-10 font-light max-w-md mx-auto">
                Looks like you haven't added anything yet. Explore our collection of premium silk care.
              </p>
              <Button
                size="lg"
                className="shadow-xl shadow-[#7c2b3d]/10 px-10"
                onClick={() => navigate("/products")}
              >
                Start Shopping
              </Button>
            </FadeIn>
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto">
            {/* Cart Items Container */}
            <FadeIn delay={200}>
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4] mb-8">
                {items.map((item, index) => {
                  const itemKey = item?.item_key || item?.key; // 中文注释：兼容字段名差异
                  const qty = item?.quantity || 1;

                  const image =
                    item?.featured_image ||
                    item?.image ||
                    item?.images?.[0] ||
                    "https://placehold.co/600x600/f8f6f4/7c2b3d?text=No+Image";

                  // 中文注释：行小计优先用后端 totals
                  const lineTotal =
                    item?.totals?.line_total ??
                    item?.totals?.total ??
                    item?.line_total ??
                    (toNumber(item?.price) * qty);

                  return (
                    <div
                      key={itemKey || index}
                      className="flex flex-col md:flex-row gap-8 py-8 border-b border-[#f0e8e4] last:border-0"
                    >
                      {/* Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-[#f8f6f4] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={image}
                          alt={item?.name || "Cart item"}
                          className="w-3/4 h-3/4 object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-1">
                              {item?.name}
                            </h3>
                            {/* 中文注释：有些 CoCart 会给 variation / meta，可后续再精炼展示 */}
                            <p className="text-sm text-[#9a8a85]">
                              {(item?.variation?.length || item?.variation) ? "Variant" : "ESTORA Collection"}
                            </p>
                          </div>

                          <p className="text-lg font-medium text-[#1d1d1f]">
                            {money(lineTotal)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4 bg-[#f8f6f4] rounded-full px-4 py-2">
                            <button
                              onClick={() => handleChangeQty(itemKey, qty, -1)}
                              disabled={qty <= 1 || loading}
                              className="text-[#1d1d1f] hover:text-[#7c2b3d] disabled:opacity-30 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-medium text-sm w-4 text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleChangeQty(itemKey, qty, 1)}
                              disabled={loading}
                              className="text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(itemKey)}
                            disabled={loading}
                            className="text-[#9a8a85] hover:text-[#c94e4e] text-sm flex items-center gap-2 group transition-colors disabled:opacity-40"
                          >
                            <span className="hidden sm:inline group-hover:underline">Remove</span>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>

            {/* Summary Section */}
            <FadeIn delay={300}>
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[#1d1d1f]">
                    <span className="text-[#9a8a85]">Subtotal</span>
                    <span className="font-medium">{money(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#1d1d1f]">
                    <span className="text-[#9a8a85]">Shipping</span>
                    <span className="text-[#7c2b3d] font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-[#f0e8e4] pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-sm text-[#9a8a85] mb-1">Total (GST incl.)</span>
                    <div className="text-3xl font-serif font-medium text-[#1d1d1f]">
                      {money(total)}
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col gap-3">
                    <Button
                      size="lg"
                      className="w-full md:w-auto px-12 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20"
                      onClick={() => navigate("/checkout")}
                      disabled={loading}
                    >
                      Checkout <ArrowRight size={18} className="ml-2" />
                    </Button>

                    <button
                      onClick={() => clear()}
                      disabled={loading}
                      className="text-xs text-[#9a8a85] hover:text-[#7c2b3d] transition-colors underline underline-offset-4 disabled:opacity-40"
                    >
                      Clear bag
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
