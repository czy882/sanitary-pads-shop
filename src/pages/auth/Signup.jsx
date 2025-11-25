import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { supabase } from '../../supabaseClient';

// --- 核心浮动标签输入组件 (Floating Label Input Component) ---
// 该组件封装了输入框和浮动标签的逻辑
const FloatingLabelInput = ({ id, label, type, value, onChange, required = false, className = '' }) => {
  // 基础输入框样式
  const inputBaseClass = "peer w-full h-12 px-5 pt-3 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all";
  
  // 标签浮动样式:
  const labelBaseClass = "absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out text-[#9a8a85] text-base font-light select-none";
  
  // 核心浮动效果：
  // 1. peer-placeholder-shown:translate-y-0, peer-placeholder-shown:scale-100: 没输入时保持原位
  // 2. peer-focus:-translate-y-[1.2rem], peer-focus:scale-75: 聚焦时上移并缩小
  // 3. peer-not-placeholder-shown:... : 输入内容后也保持上移和缩小状态
  const labelFloatClass = "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-[1.2rem] peer-focus:scale-75 peer-focus:text-[#7c2b3d] peer-not-placeholder-shown:-translate-y-[1.2rem] peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:text-[#7c2b3d] text-xs uppercase tracking-widest";

  // 注意：placeholder 必须是 " " (空格) 才能确保 :placeholder-shown 状态在初始加载时生效
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBaseClass} pt-3`} // 增加 padding-top 避免文字被遮挡
        placeholder=" " 
        required={required}
      />
      <label
        htmlFor={id}
        className={`${labelBaseClass} ${labelFloatClass}`}
      >
        {label}
      </label>
    </div>
  );
};
// --- 核心浮动标签输入组件结束 ---

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`
          }
        }
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        alert(`Welcome ${firstName}! Account created successfully.`);
        navigate('/'); 
      } else {
        setError('Registration successful. Please check your email for verification.');
      }

    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#f8f6f4] pt-32 pb-20 px-4 animate-fade-in flex items-center justify-center font-sans">
      
      {/* 卡片式容器 */}
      <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-3">Create Account</h1>
          <p className="text-[#9a8a85] text-sm font-light">
            Become a member to track orders, manage subscriptions, and receive exclusive wellness tips.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          
          {/* 1. Name Fields (使用 Floating Label) */}
          <div className="grid grid-cols-2 gap-4">
            <FloatingLabelInput 
              id="firstName"
              label="First Name"
              type="text" 
              value={firstName} 
              onChange={setFirstName} 
              required
            />
            <FloatingLabelInput 
              id="lastName"
              label="Last Name"
              type="text" 
              value={lastName} 
              onChange={setLastName} 
              required
            />
          </div>

          {/* 2. Email Address (Fixed Input) */}
          <FloatingLabelInput 
            id="email"
            label="Email Address"
            type="email" 
            value={email} 
            onChange={setEmail} 
            required
          />

          {/* 3. Password */}
          <FloatingLabelInput 
            id="password"
            label="Password (At least 8 characters)"
            type="password" 
            value={password} 
            onChange={setPassword} 
            required
          />
          
          {/* 4. Confirm Password */}
          <FloatingLabelInput 
            id="confirmPassword"
            label="Confirm Password"
            type="password" 
            value={confirmPassword} 
            onChange={setConfirmPassword} 
            required
          />

          {/* 5. Marketing Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#e5d5d0] bg-[#fcf9f8] checked:border-[#7c2b3d] checked:bg-[#7c2b3d] transition-all" />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none">
                  <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm text-[#5a5a5a] font-light leading-tight group-hover:text-[#1d1d1f] transition-colors select-none">
                Email me with news and offers. I know I can unsubscribe at any time.
              </span>
            </label>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="text-sm text-center text-[#7c2b3d] bg-[#fdf2f4] p-3 rounded-xl border border-[#f0d5da]">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-base shadow-lg shadow-[#7c2b3d]/20" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm text-[#9a8a85]">
           Already have an account?{' '}
           <Link to="/login" className="text-[#7c2b3d] font-medium hover:text-[#5a1e2b] hover:underline transition-colors">
             Log in
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;