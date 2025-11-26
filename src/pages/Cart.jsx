import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';

// --- 动画辅助组件 (复用) ---
// 如果你不想在这个文件里再定义一次，可以将 FadeIn 提取到 components/FadeIn.jsx 并引入
// 这里为了方便直接内联一个简单的版本
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <div 
    className={`animate-slide-up ${className}`}
    style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
);

const Cart = ({ cart, onUpdateQuantity, onRemoveFromCart }) => { 
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <FadeIn>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-center mb-6 tracking-tight text-[#1d1d1f]">
            Your Shopping Bag
            </h1>
        </FadeIn>
        
        {cart.length > 0 && (
           <FadeIn delay={100}>
                <p className="text-center text-[#9a8a85] mb-12 font-light">
                    Complimentary shipping on all orders over $50.
                </p>
           </FadeIn>
        )}

        {cart.length === 0 ? (
          // === 空状态设计 (Empty State) ===
          <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <FadeIn delay={200} className="relative mb-8">
                {/* 装饰性背景圆 */}
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
                    {/* 图标：使用 Lucide 的 ShoppingBag，你可以换成自定义 SVG 插画 */}
                    <ShoppingBag size={64} strokeWidth={1} className="text-[#e5d5d0]" />
                </div>
                {/* 装饰性小圆点 */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-[#7c2b3d]/10 rounded-full blur-sm"></div>
                <div className="absolute bottom-4 left-2 w-4 h-4 bg-[#7c2b3d]/20 rounded-full blur-sm"></div>
            </FadeIn>
            
            <FadeIn delay={300} className="text-center">
                <h2 className="text-2xl font-serif text-[#1d1d1f] mb-3">Your bag is currently empty</h2>
                <p className="text-[#9a8a85] mb-10 font-light max-w-md mx-auto">
                    Looks like you haven't added anything yet. Explore our collection of premium silk care.
                </p>
                <Button 
                    size="lg" 
                    className="shadow-xl shadow-[#7c2b3d]/10 px-10"
                    onClick={() => navigate('/products')}
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
                {cart.map((item, index) => (
                    <div 
                    key={item.id} 
                    className="flex flex-col md:flex-row gap-8 py-8 border-b border-[#f0e8e4] last:border-0"
                    >
                    {/* Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-[#f8f6f4] rounded-2xl flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.name} className="w-3/4 h-3/4 object-contain mix-blend-multiply" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-1">{item.name}</h3>
                                <p className="text-sm text-[#9a8a85]">{item.category} Collection</p>
                            </div>
                            <p className="text-lg font-medium text-[#1d1d1f]">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-4 bg-[#f8f6f4] rounded-full px-4 py-2">
                                <button 
                                onClick={() => onUpdateQuantity(item.id, -1)} 
                                disabled={item.quantity <= 1} 
                                className="text-[#1d1d1f] hover:text-[#7c2b3d] disabled:opacity-30 transition-colors"
                                >
                                <Minus size={16} />
                                </button>
                                <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                                <button 
                                onClick={() => onUpdateQuantity(item.id, 1)} 
                                className="text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                                >
                                <Plus size={16} />
                                </button>
                            </div>

                            <button 
                            onClick={() => onRemoveFromCart(item.id)} 
                            className="text-[#9a8a85] hover:text-[#c94e4e] text-sm flex items-center gap-2 group transition-colors"
                            >
                            <span className="hidden sm:inline group-hover:underline">Remove</span>
                            <Trash2 size={18} /> 
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </FadeIn>

            {/* Summary Section */}
            <FadeIn delay={300}>
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-[#1d1d1f]">
                        <span className="text-[#9a8a85]">Subtotal</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#1d1d1f]">
                        <span className="text-[#9a8a85]">Shipping</span>
                        <span className="text-[#7c2b3d] font-medium">Free</span>
                    </div>
                </div>
                
                <div className="border-t border-[#f0e8e4] pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-sm text-[#9a8a85] mb-1">Total (GST incl.)</span>
                        <div className="text-3xl font-serif font-medium text-[#1d1d1f]">${total.toFixed(2)}</div>
                    </div>
                    
                    {/* 点击跳转到 checkout 页面 */}
                    <Button 
                        size="lg" 
                        className="w-full md:w-auto px-12 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20" 
                        onClick={() => navigate('/checkout')}
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