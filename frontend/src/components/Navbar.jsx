import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);
  const [user, setUser] = useState(null);
  
  // MỚI: States cho tính năng gợi ý
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = "http://127.0.0.1:8000";

  const fetchNavbarData = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      setUser(savedUser);

      if (savedUser && savedUser.id) {
        const cartRes = await axios.get(`${BASE_URL}/cart/${savedUser.id}`);
        const totalCart = Array.isArray(cartRes.data) 
          ? cartRes.data.reduce((sum, item) => sum + (item.quantity || 0), 0) 
          : 0;
        setCartCount(totalCart);

        try {
          const wishRes = await axios.get(`${BASE_URL}/wishlist/${savedUser.id}`);
          setWishCount(Array.isArray(wishRes.data) ? wishRes.data.length : 0);
        } catch (wishErr) {
          setWishCount(0);
        }
      } else {
        setCartCount(0);
        setWishCount(0);
      }
    } catch (error) {
      console.error("Lỗi cập nhật Navbar:", error);
    }
  };

  // MỚI: Xử lý lấy gợi ý tìm kiếm (Debounce 300ms)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.trim().length > 0) {
        try {
          const res = await axios.get(`${BASE_URL}/api/books/suggestions?q=${keyword}`);
          setSuggestions(res.data);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Lỗi lấy gợi ý:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [keyword]);

  useEffect(() => {
    fetchNavbarData();
    const interval = setInterval(fetchNavbarData, 3000);
    return () => clearInterval(interval);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword);
      setShowSuggestions(false); // Đóng gợi ý khi nhấn Enter
      navigate("/");
    }
  };

  // MỚI: Hàm xử lý khi chọn một quyển sách từ danh sách gợi ý
  const handleSelectSuggestion = (title) => {
    setKeyword(title);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(title);
      navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" onClick={() => onSearch("")} className="text-2xl font-bold text-indigo-600">
          BookStore
        </Link>
        <Link to="/about" className="text-sm font-black text-gray-500 hover:text-indigo-600 transition-colors hidden md:block uppercase tracking-widest">
          Giới thiệu
        </Link>
        <Link to="/contact" className="text-sm font-black text-gray-500 hover:text-indigo-600 transition-colors hidden md:block uppercase tracking-widest ml-6">
          Liên hệ
        </Link>
        {/* Search Bar - MỚI: Thêm dropdown gợi ý */}
        <form onSubmit={handleSearch} className="flex-1 mx-8 max-w-md hidden md:block relative">
          <div className="relative">
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay để kịp nhấn chuột
              onFocus={() => keyword.length > 0 && setShowSuggestions(true)}
              placeholder="Tìm tên sách..." 
              className="w-full border border-gray-300 rounded-full px-5 py-2 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
            />
          </div>

          {/* Dropdown gợi ý */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[60]">
              {suggestions.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectSuggestion(book.title)}
                  className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b last:border-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{book.title}</span>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="flex items-center gap-2">
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-bold text-sm hidden sm:block">
              Quản trị
            </Link>
          )}

          {user ? (
            <>
              {/* Đơn hàng */}
              <Link to="/orders" className="p-2 hover:bg-blue-50 rounded-full" title="Đơn hàng">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 hover:bg-pink-50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishCount > 0 && (
                  <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 hover:bg-indigo-50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Identity */}
              <div className="flex items-center gap-3 ml-2 border-l pl-4">
                <span className="text-sm font-medium text-gray-700 hidden lg:block">Chào, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
                >
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-indigo-600 px-4 py-2 text-sm font-bold">Đăng nhập</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;