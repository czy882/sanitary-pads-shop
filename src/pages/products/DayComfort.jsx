import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check, ShieldCheck, Leaf, Droplets, Wind, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import { useQuery, gql } from '@apollo/client'; // 1. 引入 Apollo
import LoadingScreen from '../../components/LoadingScreen'; // 确保你有这个组件，没有的话删掉这行用简单的div

// --- 2. 定义 GraphQL 查询 ---
// 我们通过 slug: "day-comfort" 来精准抓取这个产品
// 包含：ID, 名字, 价格, 图片, 短描述(做Tagline), 长描述
const GET_DAY_COMFORT = gql`
  query GetDayComfort {
    product(id: "day-comfort", idType: SLUG) {
      id
      databaseId
      name
      slug
      shortDescription(format: RAW) # 用作 Tagline (副标题)
      description(format: RAW)      # 用作主要介绍
      image {
        sourceUrl
      }
      ... on SimpleProduct {
        price
        regularPrice
        stockStatus
      }
    }
  }
`;

// --- 动画辅助组件 (保持你的优化版不变) ---
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

const DayComfort = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // --- 3. 发起查询，获取后台数据 ---
  const { loading, error, data } = useQuery(GET_DAY_COMFORT);

  // 4. 定义规格 (因为WP默认没有这个字段，为了保持UI布局，我们暂时在这里定义)
  // 如果以后需要动态化，可以使用 Attributes
  const SPECS = ["245mm", "Day Use", "10 Pads/Box"];

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec') setQuantity(q => Math.max(1, q - 1));
  };

  // 5. 价格解析辅助函数 (把 "$19.90" 这种字符串变成数字 19.90)
  const getNumericPrice = (priceString) => {
    if (!priceString) return 0;
    // 移除除了数字和小数点以外的所有字符
    return parseFloat(priceString.replace(/[^0-9.]/g, ''));
  };

  // --- 加载与错误处理 ---
  if (loading) return <LoadingScreen />;
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500 bg-[#f8f6f4]">
      <p className="text-xl mb-4">Failed to load product.</p>
      <p className="text-sm">请检查 WordPress 后台是否存在 Slug 为 "day-comfort" 的产品。</p>
      <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );

  const product = data?.product;
  if (!product) return <div className="pt-32 text-center">Product not found.</div>;

  // 计算总价 (用于按钮显示)
  const unitPrice = getNumericPrice(product.price);
  const totalPrice = (unitPrice * quantity).toFixed(2);

  // 处理 Tagline (去除 HTML 标签)
  const tagline = product.shortDescription 
    ? product.shortDescription.replace(/<[^>]*>?/gm, '') 
    : "Your daily ritual of softness and protection.";

  return (
    <div className="bg-white min-h-screen font-sans text-[#1d1d1f]">
      
      {/* === Main Product Section === */}
      <div className="max-w-[1400px] mx-auto pt-24 md:pt-32 px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Sticky Gallery */}
          <div className="lg:w-1/2 h-fit lg:sticky lg:top-32">
            <FadeIn className="h-full">
              <div className="bg-[#f8f6f4] rounded-[3rem] aspect-4/5 mb-6 relative overflow-hidden flex items-center justify-center group">
                 {/* 动态主图 */}
                 <img 
                   src={product.image?.sourceUrl || 'https://placehold.co/600x800/f8f6f4/7c2b3d?text=No+Image'} 
                   alt={product.name} 
                   className="w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute bottom-6 left-0 w-full text-center text-[#9a8a85] text-xs tracking-widest uppercase">
                   Premium Packaging
                 </div>
              </div>
            </FadeIn>
            
            {/* 这里的次要图片如果是静态资源，可以保留不动；如果是动态的，需要后台相册支持 */}
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
              {/* 动态标题 */}
              <h1 className="text-4xl md:text-6xl font-serif font-medium text-[#1d1d1f] mb-3 tracking-tight">
                {product.name}
              </h1>
            </FadeIn>
            
            <FadeIn delay={200}>
              {/* 动态 Tagline */}
              <p className="text-xl text-gray-500 mb-8 font-light">
                  {tagline}
              </p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 pb-8">
                 {/* 动态价格 */}
                 <span className="text-3xl font-medium">{product.price}</span>
                 <span className="text-sm text-gray-400">GST Included</span>
                 {/* 库存状态 */}
                 {product.stockStatus === 'OUT_OF_STOCK' && (
                    <span className="text-sm text-red-500 font-bold ml-auto">Out of Stock</span>
                 )}
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                {/* 保留了你的硬编码文案结构，但在开头尝试注入后台描述。
                   如果你想完全用后台文字，可以用 dangerouslySetInnerHTML 替换这一整段。
                */}
                {product.description ? product.description.replace(/<[^>]*>?/gm, '') : ''} 
                {' '}
                Designed for the modern Australian lifestyle, our Day Comfort pads combine the 
                luxury of <strong>100% Mulberry Silk</strong> with patented absorbency technology. 
                Perfect for active days, office hours, or light movement.
              </p>
            </FadeIn>

            {/* 规格展示 (静态 SPECS) */}
            <FadeIn delay={500}>
              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Length</div>
                    <div className="font-medium">{SPECS[0]}</div>
                 </div>
                 <div className="border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Quantity</div>
                    <div className="font-medium">{SPECS[2]}</div>
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
                   // 构造购物车对象 (使用 databaseId 作为唯一ID)
                   onClick={() => onAddToCart({
                       id: product.databaseId, 
                       name: product.name,
                       price: product.price, 
                       image: product.image?.sourceUrl,
                       quantity
                   })}
                   disabled={product.stockStatus === 'OUT_OF_STOCK'}
                 >
                   {product.stockStatus === 'OUT_OF_STOCK' 
                      ? 'Out of Stock' 
                      : `Add to Cart - $${totalPrice}`
                   }
                 </Button>
              </div>
            </FadeIn>

            {/* === 详细卖点介绍 (保持不变) === */}
            <div className="space-y-24 mt-20">
               {/* ... (这里保留了你所有的 Feature 代码，完全不动) ... */}
               
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
                              Our core locks fluid instantly—holding up to 50x its weight—keeping the surface 
                              dry and pristine. No reverse osmosis, just confidence.
                           </p>
                        </div>
                     </div>
                  </div>
               </FadeIn>

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