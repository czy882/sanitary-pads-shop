//src/pages/Cart.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Button from "../components/Button";

// ================================
// ✅ 工具函数：价格解包 + 格式化
// ================================

// 中文注释：把后端可能返回的各种 price 结构统一转成 number
function getPriceNumber(priceLike) {
  if (priceLike == null) return 0;

  // 1) 直接是数字/字符串
  if (typeof priceLike === "number") return priceLike;

  if (typeof priceLike === "string") {
    // 可能是 "$45.00" / "45.00" / "AUD 45.00" 等
    const n = Number(priceLike.replace(/[^\d.]/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }

  // 2) 可能是对象：{ value, min_purchase, max_purchase }
  if (typeof priceLike === "object") {
    const v = priceLike.value ?? priceLike.min_purchase ?? priceLike.max_purchase;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }

  return 0;
}

// 中文注释：货币格式化（澳币）
function formatAUD(n) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(Number(n) || 0);
}

// 中文注释：把 cart 统一成 “可渲染 item 数组”
// 兼容：
// - cart 本身就是数组
// - cart.items 是数组
// - cart.items 是对象（key -> item）
// - cart.line_items / cart.cart_contents 等（不同实现）
function normalizeCartItems(cart) {
  if (!cart) return [];

  if (Array.isArray(cart)) return cart;

  const maybeItems =
    cart.items ?? cart.line_items ?? cart.cart_items ?? cart.cart_contents ?? cart.contents;

  if (!maybeItems) return [];

  if (Array.isArray(maybeItems)) return maybeItems;

  if (typeof maybeItems === "object") {
    // 例如：{ "abc123": { ... }, "def456": { ... } }
    return Object.values(maybeItems);
  }

  return [];
}

// 中文注释：尽量统一取到 item 的“唯一 key”
// CoCart 通常用 item_key 或 key；本地 mock 可能用 id
function getItemKey(item) {
  return item?.item_key ?? item?.key ?? item?.cart_item_key ?? item?.id;
}

// 中文注释：尽量统一取到展示字段
function getItemName(item) {
  return item?.name ?? item?.product_name ?? item?.title ?? "Item";
}

function getItemImage(item) {
  // 兼容：image string / images array / featured_image
  if (typeof item?.image === "string") return item.image;
  if (item?.images?.[0]?.src) return item.images[0].src;
  if (item?.images?.[0]?.source_url) return item.images[0].source_url;
  if (item?.featured_image) return item.featured_image;
  return null;
}

// 中文注释：尽量统一 quantity
function getItemQuantity(item) {
  const q = item?.quantity ?? item?.qty ?? item?.quantity?.value;
  const n = Number(q);
  return Number.isNaN(n) || n <= 0 ? 1 : n;
}

// 中文注释：尽量统一价格字段
function getItemUnitPrice(item) {
  // 常见字段：price / prices?.price / totals?.line_subtotal / totals?.line_total / item.price.value
  if (item?.price != null) return getPriceNumber(item.price);

  if (item?.prices?.price != null) return getPriceNumber(item.prices.price);

  // 如果后端只给了 line_total/line_subtotal（那是总价），就退回 0
  // 你也可以在这里按 qty 反推单价（但容易出税/折扣误差）
  return 0;
}

// ================================
// 动画辅助组件（保留你的风格）
// ================================
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <div
    className={`animate-slide-up ${className}`}
    style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: "forwards" }}
  >
    {children}
  </div>
);

/**
 * Cart 组件
 * - 仍沿用你之前的 props 结构：cart / onUpdateQuantity / onRemoveFromCart
 * - 但内部已更强容错：cart 可以是数组，也可以是对象结构（CoCart/Woo 结构）
 */
const Cart = ({ cart, onUpdateQuantity, onRemoveFromCart }) => {
  const navigate = useNavigate();

  const items = normalizeCartItems(cart);

  // 中文注释：计算总价（单价 * qty）
  const total = items.reduce((acc, item) => {
    const qty = getItemQuantity(item);
    const unit = getItemUnitPrice(item);
    return acc + unit * qty;
  }, 0);

  const hasItems = items.length > 0;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-center mb-6 tracking-tight text-[#1d1d1f]">
            Your Shopping Bag
          </h1>
        </FadeIn>

        {hasItems && (
          <FadeIn delay={100}>
            <p className="text-center text-[#9a8a85] mb-12 font-light">
              Complimentary shipping on all orders over $50.
            </p>
          </FadeIn>
        )}

        {!hasItems ? (
          // === 空状态设计 (Empty State) ===
          <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <FadeIn delay={200} className="relative mb-8">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
                <ShoppingBag size={64} strokeWidth={1} className="text-[#e5d5d0]" />
              </div>
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#7c2b3d]/10 rounded-full blur-sm"></div>
              <div className="absolute bottom-4 left-2 w-4 h-4 bg-[#7c2b3d]/20 rounded-full blur-sm"></div>
            </FadeIn>

            <FadeIn delay={300} className="text-center">
              <h2 className="text-2xl font-serif text-[#1d1d1f] mb-3">Your bag is currently empty</h2>
              <p className="text-[#9a8a85] mb-10 font-light max-w-md mx-auto">
                Looks like you haven&apos;t added anything yet. Explore our collection of premium silk care.
              </p>
              <Button size="lg" className="shadow-xl shadow-[#7c2b3d]/10 px-10" onClick={() => navigate("/products")}>
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
                  const key = getItemKey(item) ?? index;
                  const qty = getItemQuantity(item);
                  const unit = getItemUnitPrice(item);
                  const lineTotal = unit * qty;

                  const name = getItemName(item);
                  const image = getItemImage(item);

                  return (
                    <div
                      key={key}
                      className="flex flex-col md:flex-row gap-8 py-8 border-b border-[#f0e8e4] last:border-0"
                    >
                      {/* Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-[#f8f6f4] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="w-3/4 h-3/4 object-contain mix-blend-multiply"
                          />
                        ) : (
                          <div className="text-xs text-[#9a8a85]">No Image</div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-6">
                          <div className="min-w-0">
                            <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-1 truncate">{name}</h3>
                            {/* 可选展示：如果你有 category/variant 字段 */}
                            <p className="text-sm text-[#9a8a85]">
                              {item?.variation?.[0]?.value ||
                                item?.variant ||
                                item?.category ||
                                "ESTORA Collection"}
                            </p>
                          </div>

                          {/* 关键修复：永远渲染 string，不渲染 object */}
                          <p className="text-lg font-medium text-[#1d1d1f] whitespace-nowrap">
                            {formatAUD(lineTotal)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4 bg-[#f8f6f4] rounded-full px-4 py-2">
                            <button
                              onClick={() => onUpdateQuantity(getItemKey(item) ?? item?.id, -1)}
                              disabled={qty <= 1}
                              className="text-[#1d1d1f] hover:text-[#7c2b3d] disabled:opacity-30 transition-colors"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="font-medium text-sm w-4 text-center">{qty}</span>

                            <button
                              onClick={() => onUpdateQuantity(getItemKey(item) ?? item?.id, 1)}
                              className="text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveFromCart(getItemKey(item) ?? item?.id)}
                            className="text-[#9a8a85] hover:text-[#c94e4e] text-sm flex items-center gap-2 group transition-colors"
                          >
                            <span className="hidden sm:inline group-hover:underline">Remove</span>
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* 如果你想显示单价（可选） */}
                        {unit > 0 && (
                          <div className="mt-4 text-xs text-[#9a8a85]">
                            Unit price: {formatAUD(unit)}
                          </div>
                        )}
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
                    <span className="font-medium">{formatAUD(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#1d1d1f]">
                    <span className="text-[#9a8a85]">Shipping</span>
                    <span className="text-[#7c2b3d] font-medium">Free</span>
                  </div>
                </div>

                <div className="border-t border-[#f0e8e4] pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-sm text-[#9a8a85] mb-1">Total (GST incl.)</span>
                    <div className="text-3xl font-serif font-medium text-[#1d1d1f]">
                      {formatAUD(total)}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full md:w-auto px-12 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout <ArrowRight size={18} className="ml-2" />
                  </Button>
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