import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { supabase } from '../../supabaseClient';
// 移除 Phone 引入
import { Mail } from 'lucide-react'; 

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // 仅保留 email 状态
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  // 新增：确认密码状态
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 移除 phone 和 mediaType 状态
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // --- 核心安全检查：确认密码是否匹配 ---
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }
    // --- 核心安全检查结束 ---

    try {
      // 1. 调用 Supabase 注册接口
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // 2. 将姓名作为 metadata 存储到 auth.users 表中
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
        // 注册成功
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
          
          {/* 1. Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">First Name</label>
              <input 
                type="text" 
                placeholder="First Name"
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">Last Name</label>
              <input 
                type="text" 
                placeholder="Last Name"
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
                required 
              />
            </div>
          </div>

          {/* 2. Email Address (Fixed Input) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">Email Address</label>
            <input 
              type="email" // 恢复为 email 类型，确保浏览器校验
              placeholder="name@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
              required 
            />
          </div>

          {/* 3. Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="At least 8 characters"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
              required 
            />
          </div>
          
          {/* 4. Confirm Password (新增确认密码框) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Re-enter password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
              required 
            />
            <p className="text-[10px] text-[#9a8a85] mt-1.5 ml-1">Ensure passwords match for security.</p>
          </div>

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