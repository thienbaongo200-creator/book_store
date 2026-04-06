import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [wishlistId, setWishlistId] = useState(null);

  const BASE_URL = "http://127.0.0.1:8000";

  // --- LẤY THÔNG TIN USER ĐÃ ĐĂNG NHẬP ---
  const getLoggedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  };

  // 1. Hàm Bật/Tắt yêu thích (Toggle)
  const toggleWishlist = async () => {
    const user = getLoggedUser();
    if (!user) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    try {
      // SỬA: Dùng API toggle chung của Backend (Gửi POST kèm user_id và book_id)
      const res = await axios.post(`${BASE_URL}/wishlist/toggle`, {
        book_id: parseInt(id),
        user_id: user.id 
      });
      
      // Backend trả về status: true (đã thêm) hoặc false (đã xóa)
      setIsFavorite(res.data.status);
    } catch (error) {
      console.error("Lỗi thao tác yêu thích:", error);
    }
  };

  // 2. Hàm kiểm tra trạng thái yêu thích ban đầu
  const fetchWishlistStatus = async () => {
    const user = getLoggedUser();
    if (!user) return;

    try {
      // SỬA: Gọi đúng endpoint /wishlist/{user_id}
      const res = await axios.get(`${BASE_URL}/wishlist/${user.id}`);
      const item = res.data.find(fav => fav.book_id === parseInt(id));
      
      if (item) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Lỗi kiểm tra yêu thích:", error);
    }
  };

  // 3. Hàm Thêm vào giỏ hàng
  const addToCart = async () => {
    const user = getLoggedUser();

    // Kiểm tra đăng nhập
    if (!user) {
      alert("Bạn cần đăng nhập để mua sách!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/cart/`, {
        book_id: book.id,
        user_id: user.id, // Truyền ID động của người dùng
        quantity: 1
      });
      alert(`🎉 Đã thêm "${book.title}" vào giỏ hàng của bạn!`);
    } catch (error) {
      alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const bookRes = await axios.get(`${BASE_URL}/books/${id}`);
        setBook(bookRes.data);
        await fetchWishlistStatus(); 
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Đang tải chi tiết sách...</p>
      </div>
    );
  }

  if (!book) return <div className="text-center py-20 font-bold">Không tìm thấy sách!</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="group mb-6 flex items-center text-gray-600 hover:text-indigo-600 font-medium">
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
        Quay lại
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50 flex flex-col md:flex-row">
        {/* Ảnh sách */}
        <div className="md:w-5/12 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
          <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-lg shadow-2xl overflow-hidden bg-white">
            <img 
              src={`${BASE_URL}${book.image_url}`} 
              alt={book.title} 
              className="w-full h-full object-contain p-4 transition-transform hover:scale-105 duration-500"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=Sách+Chưa+Có+Ảnh'; }}
            />
          </div>
        </div>

        {/* Thông tin sách */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-6">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                SKU: {book.id}
              </span>
              <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${book.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {book.stock > 0 ? `CÒN HÀNG: ${book.stock}` : 'HẾT HÀNG'}
              </span>
            </div>

            <h1 className="text-4xl font-black text-gray-900 mb-2 leading-tight tracking-tight">{book.title}</h1>
            <p className="text-xl text-gray-400 mb-8 font-medium">Tác giả: <span className="text-indigo-600">{book.author}</span></p>

            <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-gray-900">{book.price?.toLocaleString('vi-VN')}</span>
                <span className="text-xl font-bold text-gray-400 uppercase">VNĐ</span>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8 relative">
                <div className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">Mô tả tóm tắt</div>
                <p className="text-gray-600 leading-relaxed italic">
                  Cuốn sách "{book.title}" là một trong những tác phẩm tâm đắc nhất của {book.author}, hứa hẹn mang lại những trải nghiệm đọc tuyệt vời và nhiều giá trị nhân văn sâu sắc cho độc giả.
                </p>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Nút Giỏ hàng */}
            <button 
              onClick={addToCart} 
              disabled={book.stock <= 0}
              className={`flex-1 py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 text-white ${
                book.stock > 0 
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-1' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {book.stock > 0 ? "THÊM VÀO GIỎ HÀNG" : "SẢN PHẨM HẾT HÀNG"}
            </button>
            
            {/* Nút Trái tim */}
            <button 
              onClick={toggleWishlist}
              className={`px-6 rounded-2xl transition-all duration-300 border-2 flex items-center justify-center hover:-translate-y-1 ${
                isFavorite 
                ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-lg shadow-rose-100' 
                : 'bg-white border-gray-100 text-gray-300 hover:border-rose-100 hover:text-rose-300'
              }`}
            >
              <span className="text-3xl">
                {isFavorite ? '❤️' : '♡'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;