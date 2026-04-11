import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  const getLoggedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  };

  const fetchWishlist = async () => {
    const user = getLoggedUser();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/wishlist/${user.id}`);
      console.log("Dữ liệu wishlist nhận được:", res.data); // Kiểm tra xem có trường 'book' chưa
      setWishlist(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu thích:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    const user = getLoggedUser();
    try {
      const res = await axios.post(`${BASE_URL}/wishlist/toggle`, {
        book_id: bookId,
        user_id: user.id
      });
      
      // Nếu backend trả về status: false nghĩa là đã xóa thành công
      if (res.data.status === false) {
        setWishlist(prev => prev.filter(item => item.book_id !== bookId));
      }
    } catch (error) {
      alert("Lỗi khi xóa khỏi danh sách yêu thích");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      <p className="mt-4 text-gray-500 font-medium italic">Đang tìm những cuốn sách yêu thích...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">
            Danh sách <span className="text-pink-500">Yêu Thích</span>
          </h1>
          <div className="h-1.5 w-20 bg-pink-500 mt-2 rounded-full"></div>
        </div>
        <span className="bg-pink-50 text-pink-600 px-6 py-2 rounded-2xl font-black text-sm self-start">
          {wishlist.length} SẢN PHẨM
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-[50px] border-4 border-dashed border-gray-100">
          <div className="text-8xl mb-6">🏜️</div>
          <p className="text-gray-400 text-xl font-black italic mb-8">Chưa có cuốn sách nào lọt vào "mắt xanh" của bạn cả!</p>
          <Link to="/" className="inline-block px-12 py-5 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200">
            QUAY LẠI CỬA HÀNG
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {wishlist.map((item) => (
            <div key={item.id} className="group bg-white rounded-[35px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden p-6 flex items-center justify-center">
                <img 
                  src={`${BASE_URL}${item.book?.image_url}`}  
                  alt={item.book?.title} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'; }}
                />
                
                {/* Nút xóa X */}
                <button 
                  onClick={() => removeFromWishlist(item.book_id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur shadow-lg flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-black text-gray-900 line-clamp-1 italic text-base mb-1">
                  {item.book?.title || "Đang tải tên..."}
                </h3>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.15em] mb-4">
                  {item.book?.author}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-black text-gray-900">
                    {item.book?.price?.toLocaleString('vi-VN')}đ
                  </span>
                  <Link 
                    to={`/books/${item.book_id}`}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
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