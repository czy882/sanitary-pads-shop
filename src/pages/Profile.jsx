import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronRight, Package, MapPin, Settings, LogOut } from 'lucide-react';
import Button from '../components/Button';
import LoadingScreen from '../components/LoadingScreen';
import { http } from '../lib/http';

const ACCOUNT_LINKS = [
  {
    title: "My Orders",
    desc: "Track, return, or buy again",
    icon: <Package size={20} />,
    path: '/profile/orders'
  },
  {
    title: "Addresses",
    desc: "Manage delivery locations",
    icon: <MapPin size={20} />,
    path: '/profile/addresses'
  },
  {
    title: "Preferences",
    desc: "Notification settings",
    icon: <Settings size={20} />,
    path: '/profile/preferences'
  }
];

const Profile = () => {
  const navigate = useNavigate();

  // ✅ 关键修复：用 state 保存 token，保证登录后会触发 Profile 更新
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');

  // 中文注释：用户信息（来自自定义 REST: /wp-json/estora/v1/me，适配 Headless + JWT）
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 中文注释：同步读取 localStorage 最新 token
  const syncTokenFromStorage = useCallback(() => {
    setToken(localStorage.getItem('authToken') || '');
  }, []);

  // ✅ 监听 token 改变（同标签页 + 跨标签页）
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'authToken') syncTokenFromStorage();
    };
    const onAuth = () => syncTokenFromStorage();

    window.addEventListener('storage', onStorage);
    window.addEventListener('estora:auth', onAuth);

    // 首次同步一次
    syncTokenFromStorage();

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('estora:auth', onAuth);
    };
  }, [syncTokenFromStorage]);

  // ✅ token 有了就拉取当前用户
  useEffect(() => {
    let mounted = true;

    const loadMe = async () => {
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        // ✅ 用我们自己的 /estora/v1/me 端点（JWT 场景下不要再用 wp/v2/users/me）
        const me = await http('/wp-json/estora/v1/me', { method: 'GET' });

        if (!mounted) return;

        // 中文注释：兼容后端可能返回的字段命名（你后端返回什么我们都能兜住）
        const mapped = {
          id: me?.id || me?.databaseId || null,
          email: me?.email || '',
          firstName: me?.firstName || me?.first_name || '',
          lastName: me?.lastName || me?.last_name || '',
          username: me?.username || me?.user_login || '',
          displayName: me?.displayName || me?.display_name || me?.name || '',
        };

        setUser(mapped);
        localStorage.setItem('user', JSON.stringify(mapped));
      } catch (e) {
        console.error(e);
        // 中文注释：认证失败视为未登录，清理本地 token + state
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        if (mounted) {
          setUser(null);
          setToken('');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const id = requestAnimationFrame(() => {
      loadMe();
    });

    return () => {
      mounted = false;
      cancelAnimationFrame(id);
    };
  }, [token]);

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken('');

    alert('You have been signed out.');
    navigate('/');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // 登录后卡片
  const LoggedInCard = () => {
    const displayName = user?.firstName
      ? `${user.firstName} ${user.lastName || ''}`
      : (user?.username || 'ESTORA Member');

    return (
      <div className="bg-white rounded-[2.5rem] p-10 mb-10 flex flex-col items-center justify-center text-center shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
        <div className="w-20 h-20 rounded-full bg-[#7c2b3d]/10 flex items-center justify-center text-[#7c2b3d] mb-4">
          <User size={40} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-2">
          Welcome, {displayName}
        </h1>

        <p className="text-gray-500 mb-6 font-light leading-relaxed">
          {user?.email || ''}
        </p>

        <Button
          variant="outline"
          className="w-full max-w-xs h-12 text-base bg-transparent border-[#e5d5d0] hover:bg-[#fcf9f8] hover:text-[#7c2b3d]"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>
    );
  };

  // 登录前卡片（只显示它，不显示 Account Settings）
  const LoggedOutCard = () => (
    <div className="bg-white rounded-[2.5rem] p-10 mb-10 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#7c2b3d]/10 flex items-center justify-center text-[#7c2b3d] mb-5">
          <User size={40} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-3">
          Welcome to ESTORA
        </h1>

        <p className="text-gray-500 mb-8 max-w-md font-light leading-relaxed">
          Sign in to view orders, manage addresses, and update your preferences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link to="/login" className="flex-1">
            <Button className="w-full h-12 text-base shadow-xl shadow-[#7c2b3d]/10">
              Log In
            </Button>
          </Link>
          <Link to="/signup" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base bg-transparent border-[#e5d5d0] hover:bg-[#fcf9f8] hover:text-[#7c2b3d]">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-32 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[800px] mx-auto px-6">
        {/* 未登录：只显示登录/注册卡片 */}
        {!user ? (
          <LoggedOutCard />
        ) : (
          <>
            <LoggedInCard />

            <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-6 px-2">
              Account Settings
            </h3>

            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.02)] border border-[#f0e8e4] divide-y divide-[#f5efec]">
              {ACCOUNT_LINKS.map((item, i) => (
                <div
                  key={i}
                  className="p-6 hover:bg-[#fcf9f8] cursor-pointer flex items-center gap-5 group transition-colors duration-300"
                  onClick={() => item.path && navigate(item.path)}
                >
                  <div className="w-12 h-12 rounded-full bg-[#f8f6f4] flex items-center justify-center text-[#9a8a85] group-hover:text-[#7c2b3d] group-hover:bg-[#7c2b3d]/10 transition-colors duration-300">
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-[#1d1d1f] font-serif text-lg group-hover:text-[#7c2b3d] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-sm text-[#9a8a85] font-light">
                      {item.desc}
                    </div>
                  </div>

                  <ChevronRight size={18} className="text-[#d0c0bc] group-hover:text-[#7c2b3d] transition-colors transform group-hover:translate-x-1 duration-300" />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Profile;