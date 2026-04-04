import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [cartCount, setCartCount] = useState(0); 
  const [wishCount, setWishCount] = useState(0); 
  const navigate = useNavigate();
  const location = useLocation();

  const BASE_URL = "http://127.0.0.1:8000";

  const fetchNavbarData = async () => {
    try {
      const cartRes = await axios.get(`${BASE_URL}/cart/`);
      const totalCart = cartRes.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCart);

      const wishRes = await axios.get(`${BASE_URL}/wishlist/`);
      setWishCount(wishRes.data.length); 
    } catch (error) {
      console.error("Lỗi cập nhật Navbar:", error);
    }
  };

  useEffect(() => {
    fetchNavbarData();
    const interval = setInterval(fetchNavbarData, 3000); 
    return () => clearInterval(interval);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword);
      navigate("/");
    }
  };

  const handleLogoClick = () => {
    setKeyword("");
    if (onSearch) onSearch("");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          onClick={handleLogoClick} 
          className="text-2xl font-bold text-indigo-600 hover:opacity-80 transition-all"
        >
          BookStore
        </button>

        {/* Thanh tìm kiếm */}
        <form onSubmit={handleSearch} className="flex-1 mx-8 max-w-md hidden md:block">
          <div className="relative">
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm tên sách bạn muốn..." 
              className="w-full border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
            <button type="submit" className="absolute right-3 top-2 text-gray-400 hover:text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Menu bên phải */}
        <div className="flex items-center gap-1 md:gap-3">
          <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium text-sm hidden lg:block mr-2">
            Quản trị
          </Link>

          {/* Icon Lịch sử đơn hàng (MỚI THÊM) */}
          <Link to="/orders" className="relative group p-2 hover:bg-blue-50 rounded-full transition-all" title="Lịch sử đơn hàng">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </Link>

          {/* Icon Yêu thích */}
          <Link to="/wishlist" className="relative group p-2 hover:bg-pink-50 rounded-full transition-all" title="Yêu thích">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishCount > 0 && (
              <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Icon Giỏ hàng */}
          <Link to="/cart" className="relative group p-2 hover:bg-indigo-50 rounded-full transition-all" title="Giỏ hàng">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;