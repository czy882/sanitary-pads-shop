import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 当路径 (pathname) 发生变化时，将窗口滚动到 (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // 这个组件不需要渲染任何可见内容
};

export default ScrollToTop;