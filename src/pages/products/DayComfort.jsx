import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check, ShieldCheck, Leaf, Droplets, Wind } from 'lucide-react';
import Button from '../../components/Button';
import { PRODUCTS } from '../../data/products';

// --- 动画辅助组件：FadeIn (优化版：更慢、更优雅) ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // 只有当元素进入视口时才设置为可见
        if (entry.isIntersecting) {
          setIsVisible(true);
          // observer.unobserve(entry.target); // 如果只想触发一次，可以取消注释这行
        }
      });
    }, { threshold: 0.1 }); // 10% 可见时触发

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    }
  }, []);

  return (
    <div
      ref={domRef}
      // 核心修改：
      // 1. duration-[1500ms]: 将动画时间从 1s 延长到 1.5s，增加“重量感”和“优雅感”
      // 2. ease-[cubic-bezier(0.16,1,0.3,1)]: 保持这种类似 Apple 的物理缓动曲线
      // 3. will-change-transform: 性能优化，防止慢速动画卡顿
      className={`transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16' // 稍微增加位移距离(12->16)，配合慢速更显张力
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const DayComfort = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const product = PRODUCTS.find(p => p.id === 1);

  if (!product) return <div className="pt-32 text-center">Product data for Day Comfort is missing. Please check products.js.</div>;

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec') setQuantity(q => Math.max(1, q - 1));
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#1d1d1f]">
      
      {/* === Main Product Section === */}
      <div className="max-w-[1400px] mx-auto pt-24 md:pt-32 px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Sticky Gallery */}
          <div className="lg:w-1/2 h-fit lg:sticky lg:top-32">
            {/* 这里通常是视口立刻可见区域，可以保持较快的初始载入，或者也用慢速 FadeIn 统一风格 */}
            <FadeIn className="h-full">
              <div className="bg-[#f8f6f4] rounded-[3rem] aspect-4/5 mb-6 relative overflow-hidden flex items-center justify-center group">
                 <img 
                   src={product.image} 
                   alt={product.name} 
                   className="w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute bottom-6 left-0 w-full text-center text-[#9a8a85] text-xs tracking-widest uppercase">
                    Premium Packaging
                 </div>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-2 gap-4">
               <FadeIn delay={150}>
                 <div className="bg-[#f8f6f4] rounded-4xl aspect-square relative overflow-hidden group cursor-pointer">
                    <img src="https://placehold.co/600x600/fdfbfb/7c2b3d?text=Silk+Texture+Macro" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Texture" />
                    <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-[#7c2b3d]">Macro Texture</span>
                 </div>
               </FadeIn>
               <FadeIn delay={300}>
                 <div className="bg-[#f8f6f4] rounded-4xl aspect-square relative overflow-hidden group cursor-pointer">
                    <img src="https://placehold.co/600x600/fdfbfb/7c2b3d?text=Ultra+Thin+Profile" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Thin Profile" />
                    <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-[#7c2b3d]">0.1cm Ultra-Thin</span>
                 </div>
               </FadeIn>
            </div>
          </div>

          {/* Right Column: Product Info & Story */}
          <div className="lg:w-1/2 pb-20">
            <FadeIn>
              <button onClick={() => navigate('/')} className="text-gray-400 text-sm mb-6 flex items-center hover:text-[#7c2b3d] transition-colors">
                <ChevronRight className="rotate-180 mr-1" size={14} /> Back to Home
              </button>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-4xl md:text-6xl font-serif font-medium text-[#1d1d1f] mb-3 tracking-tight">
                {product.name}
              </h1>
            </FadeIn>
            
            <FadeIn delay={200}>
              <p className="text-xl text-gray-500 mb-8 font-light">{product.tagline}</p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 pb-8">
                 <span className="text-3xl font-medium">${product.price}</span>
                 <span className="text-sm text-gray-400">GST Included</span>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                {product.description} Designed for the modern Australian lifestyle, our Day Comfort pads combine the 
                luxury of <strong>100% Mulberry Silk</strong> with patented absorbency technology. 
                Perfect for active days, office hours, or light movement.
              </p>
            </FadeIn>

            {/* 规格展示 */}
            <FadeIn delay={500}>
              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Length</div>
                    <div className="font-medium">{product.specs[0]}</div>
                 </div>
                 <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Quantity</div>
                    <div className="font-medium">{product.specs[2]}</div>
                 </div>
              </div>
            </FadeIn>

            {/* 购买操作区 (Sticky) */}
            <FadeIn delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 mb-12 sticky top-4 z-20 bg-white/90 backdrop-blur-sm py-4">
                 <div className="flex items-center justify-between bg-[#f5f5f7] rounded-full px-4 h-14 sm:w-40">
                    <button onClick={() => handleQuantity('dec')} className="text-xl px-2 hover:text-[#7c2b3d]">-</button>
                    <span className="font-medium">{quantity}</span>
                    <button onClick={() => handleQuantity('inc')} className="text-xl px-2 hover:text-[#7c2b3d]">+</button>
                 </div>
                 <Button 
                   className="flex-1 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20" 
                   onClick={() => onAddToCart({...product, quantity})}
                 >
                   Add to Cart - ${(product.price * quantity).toFixed(2)}
                 </Button>
              </div>
            </FadeIn>

            {/* === 详细卖点介绍 (滚动触发区域) === */}
            <div className="space-y-24 mt-20"> {/* 增加间距，让滚动更有节奏感 */}
               
               {/* Feature 1: 材质 */}
               <FadeIn>
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Leaf size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Nature's Embrace</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Skincare for your intimate area.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Unlike synthetic alternatives, our top sheet is crafted from <strong>100% Natural Mulberry Silk</strong>. 
                     Rich in 18 amino acids and natural proteins, it actively nourishes delicate skin, 
                     maintaining a balanced pH of 5.7 to prevent irritation.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-500">
                     <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#7c2b3d]"></span> 99% Natural Antibacterial (Sericin)</li>
                     <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#7c2b3d]"></span> Reduces itchiness and redness</li>
                     <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#7c2b3d]"></span> Hypoallergenic & Dermatologist tested</li>
                  </ul>
               </FadeIn>

               {/* Feature 2: 工艺 */}
               <FadeIn>
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Wind size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Breathable Engineering</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">The Global Exclusive Patent.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     We use a revolutionary <strong>Spunlace Technology</strong> (water-jet entanglement) instead of glues 
                     to bond the silk layer. This creates a structure that is incredibly porous and breathable, 
                     eliminating the "sauna effect" of traditional pads.
                  </p>
                  <div className="bg-[#f8f6f4] p-8 rounded-4xl mt-6">
                     <div className="flex items-start gap-5">
                        <div className="bg-white p-4 rounded-full text-[#7c2b3d] shadow-sm shrink-0">
                           <Droplets size={24} />
                        </div>
                        <div>
                           <div className="font-serif text-xl mb-2">50x Instant Absorption</div>
                           <p className="text-sm text-gray-500 leading-relaxed">
                              Our core locks fluid instantly—holding up to 50x its own weight—keeping the surface 
                              dry and pristine. No reverse osmosis, just confidence.
                           </p>
                        </div>
                     </div>
                  </div>
               </FadeIn>

               {/* Feature 3: 安全 */}
               <FadeIn>
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <ShieldCheck size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Medical-Grade Purity</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Zero compromise on safety.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     We believe period care should be as clean as the food you eat. AURORA pads are manufactured 
                     in a medical-grade sterile environment.
                  </p>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-6">
                     {['0 Fluorescent Agents', '0 Bleach', '0 Formaldehyde', '0 Plasticizers'].map(item => (
                        <div key={item} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#7c2b3d]"></div>
                           {item}
                        </div>
                     ))}
                  </div>
               </FadeIn>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayComfort;