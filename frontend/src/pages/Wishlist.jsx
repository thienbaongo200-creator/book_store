import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  // 1. Lấy thông tin User từ LocalStorage
  const getLoggedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  };

  // 2. Fetch Wishlist theo User ID
  const fetchWishlist = async () => {
    const user = getLoggedUser();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // SỬA: Thêm ID người dùng vào URL để tránh lỗi 404/405
      const res = await axios.get(`${BASE_URL}/wishlist/${user.id}`);
      setWishlist(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu thích:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Xóa khỏi danh sách yêu thích
  const removeFromWishlist = async (bookId, wishlistRecordId) => {
  const user = getLoggedUser();
  try {
    // Gọi toggle với book_id để Backend tự xóa
    await axios.post(`${BASE_URL}/wishlist/toggle`, {
      book_id: bookId,
      user_id: user.id
    });
    
    // Cập nhật giao diện bằng cách lọc bỏ record có wishlistRecordId
    setWishlist(prev => prev.filter(item => item.id !== wishlistRecordId));
  } catch (error) {
    alert("Lỗi khi xóa khỏi danh sách yêu thích");
  }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      <p className="mt-4 text-gray-500 font-medium">Đang tải danh sách của bạn...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Yêu thích <span className="text-pink-500">.</span>
        </h1>
        <span className="bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full font-bold text-sm">
          {wishlist.length} sản phẩm
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-6">💖</div>
          <p className="text-gray-500 text-xl font-bold mb-8">Danh sách yêu thích đang trống</p>
          <Link to="/" className="inline-block px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all">
            ĐI TÌM CUỐN SÁCH BẠN THÍCH
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <div key={item.id} className="group bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                <img 
                  src={`${BASE_URL}${item.book?.image_url}`}  
                  alt={item.book?.title} 
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'; }}
                />
                {/* Nút xóa */}
                <button 
                  onClick={() => removeFromWishlist(item.book.id, item.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur shadow-lg flex items-center justify-center rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all transform scale-0 group-hover:scale-100"
                  title="Bỏ yêu thích"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <h3 className="font-black text-gray-900 truncate text-lg italic mb-1">
                  {item.book?.title || "Sách không khả dụng"}
                </h3>
                <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-4">
                  {item.book?.author}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xl font-black text-gray-900 tracking-tighter">
                    {item.book?.price?.toLocaleString('vi-VN')}đ
                  </span>
                  <Link 
                    to={`/books/${item.book?.id}`}
                    className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;