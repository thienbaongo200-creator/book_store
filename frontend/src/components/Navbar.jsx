import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [cartCount, setCartCount] = useState(0); // State lưu số lượng giỏ hàng
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để theo dõi sự thay đổi trang

  const BASE_URL = "http://127.0.0.1:8000";

  // Hàm lấy dữ liệu giỏ hàng từ Backend
  const fetchCartCount = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/`);
      // Tính tổng số lượng (quantity) của tất cả các món trong giỏ
      const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
    }
  };

  // Tự động chạy khi load trang hoặc khi chuyển trang
  useEffect(() => {
    fetchCartCount();
    
    // Tạo một interval nhỏ để cập nhật số lượng liên tục (tuỳ chọn)
    // Hoặc bạn có thể dùng Context API/Redux để quản lý chuyên nghiệp hơn
    const interval = setInterval(fetchCartCount, 3000); 
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
        <div className="flex items-center gap-6">
          <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors">
            Quản trị
          </Link>

          {/* Icon Giỏ hàng */}
          <Link to="/cart" className="relative group p-2 hover:bg-indigo-50 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            
            {/* Badge số lượng thực tế */}
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