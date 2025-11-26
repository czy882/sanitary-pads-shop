import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Moon, Shield, Droplets, HeartHandshake, Sparkles } from 'lucide-react';
import Button from '../../components/Button';
import { PRODUCTS } from '../../data/products';

// --- 动画辅助组件：FadeIn (与 DayComfort 一致) ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    }
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const NightSanctuary = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // 获取 ID 为 2 的产品 (Night Sanctuary)
  const product = PRODUCTS.find(p => p.id === 2);

  if (!product) return <div className="pt-32 text-center">Product data missing</div>;

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec') setQuantity(q => Math.max(1, q - 1));
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#1d1d1f]">
      
      <div className="max-w-[1400px] mx-auto pt-24 md:pt-32 px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* === Left: Visual Gallery === */}
          <div className="lg:w-1/2 h-fit lg:sticky lg:top-32">
            <FadeIn>
              {/* 主图：深色背景强调夜用氛围 */}
              <div className="bg-[#2c3e50]/5 rounded-[3rem] aspect-4/5 mb-6 relative overflow-hidden flex items-center justify-center group">
                 <img 
                   src={product.image} 
                   alt={product.name} 
                   className="w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute bottom-6 left-0 w-full text-center text-[#576574] text-xs tracking-widest uppercase">
                    Overnight Security
                 </div>
              </div>
            </FadeIn>
            
            {/* 细节图 */}
            <div className="grid grid-cols-2 gap-4">
               <FadeIn delay={150}>
                 <div className="bg-[#f8f6f4] rounded-4xl aspect-square relative overflow-hidden group cursor-pointer">
                    <img src="https://placehold.co/600x600/2c3e50/ffffff?text=290mm+Length" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Length" />
                    <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-white/90 mix-blend-difference">Extra Length</span>
                 </div>
               </FadeIn>
               <FadeIn delay={300}>
                 <div className="bg-[#f8f6f4] rounded-4xl aspect-square relative overflow-hidden group cursor-pointer">
                    <img src="https://placehold.co/600x600/fdfbfb/7c2b3d?text=Side+Guards" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Leak Proof" />
                    <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-[#7c2b3d]">Leak Guards</span>
                 </div>
               </FadeIn>
            </div>
          </div>

          {/* === Right: Content === */}
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
              <p className="text-xl text-gray-500 mb-8 font-light flex items-center gap-2">
                <Moon size={20} className="text-[#7c2b3d]" /> {product.tagline}
              </p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 pb-8">
                 <span className="text-3xl font-medium">${product.price}</span>
                 <span className="text-sm text-gray-400">GST Included</span>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                Engineered for heavy flow and restless nights. The <strong>Night Sanctuary</strong> pads feature an extended 290mm length 
                and our patented 50x absorption core, ensuring you wake up feeling fresh, dry, and ready for the day.
              </p>
            </FadeIn>

            {/* Specs Grid */}
            <FadeIn delay={500}>
              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Length</div>
                    <div className="font-medium">{product.specs[0]}</div>
                 </div>
                 <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Absorbency</div>
                    <div className="font-medium">Heavy / Overnight</div>
                 </div>
              </div>
            </FadeIn>

            {/* Purchase Action */}
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

            {/* Detailed Features */}
            <div className="space-y-24 mt-20">
               
               {/* Feature 1: Absorption */}
               <FadeIn>
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Droplets size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">50x Absorption Core</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Sleep through the night.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Tossing and turning? No problem. Our <strong>patented absorbent core</strong> locks away fluid up to 
                     50 times its weight instantly. Combined with anti-leak barriers, it prevents reverse osmosis for 
                     total dryness until morning.
                  </p>
               </FadeIn>

               {/* Feature 2: Skin Repair */}
               <FadeIn>
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Sparkles size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Overnight Skin Repair</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Nourish while you sleep.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Nighttime is when your skin heals. Our <strong>100% Mulberry Silk</strong> top sheet releases 18 natural amino acids, 
                     creating a breathable, pH-balanced environment that soothes sensitivity and reduces bacteria growth by 99%.
                  </p>
               </FadeIn>

               {/* Feature 3: Safety */}
               <FadeIn>
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Shield size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Zero Irritation</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Wake up fresh.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Say goodbye to morning itchiness. Free from plastics, fragrances, and bleaches, AURORA pads are 
                     dermatologically tested to have a <strong>0% sensitization rate</strong>. Pure comfort, all night long.
                  </p>
                  <div className="flex gap-4 text-sm font-medium text-gray-500">
                     <span className="flex items-center gap-2"><HeartHandshake size={16} className="text-[#7c2b3d]"/> Hypoallergenic</span>
                     <span className="flex items-center gap-2"><Shield size={16} className="text-[#7c2b3d]"/> Breathable Back Sheet</span>
                  </div>
               </FadeIn>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NightSanctuary;