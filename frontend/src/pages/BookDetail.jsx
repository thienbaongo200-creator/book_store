import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [wishlistId, setWishlistId] = useState(null); // Lưu ID của mục yêu thích để xóa

  const BASE_URL = "http://127.0.0.1:8000";
  const USER_ID = 1; 

  // 1. Hàm Bật/Tắt yêu thích (Toggle)
  const toggleWishlist = async () => {
    try {
      if (isFavorite) {
        // Nếu đã yêu thích -> Thực hiện XÓA
        // Lưu ý: Backend của bạn cần endpoint DELETE /wishlist/{id}
        await axios.delete(`${BASE_URL}/wishlist/${wishlistId}`);
        setIsFavorite(false);
        setWishlistId(null);
      } else {
        // Nếu chưa yêu thích -> Thực hiện THÊM
        const res = await axios.post(`${BASE_URL}/wishlist/`, {
          book_id: book.id,
          user_id: USER_ID
        });
        setIsFavorite(true);
        // Sau khi thêm, ta nên fetch lại hoặc lấy ID từ res để có thể xóa ngay sau đó
        fetchWishlistStatus(); 
      }
    } catch (error) {
      console.error("Lỗi thao tác yêu thích:", error);
      // Nếu lỗi do sách đã tồn tại (trường hợp DB chưa kịp update), hãy refresh lại status
      fetchWishlistStatus();
    }
  };

  // 2. Hàm kiểm tra trạng thái yêu thích
  const fetchWishlistStatus = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/wishlist/`);
      // Tìm xem cuốn sách hiện tại có trong danh sách yêu thích không
      const item = res.data.find(fav => fav.book_id === parseInt(id));
      if (item) {
        setIsFavorite(true);
        setWishlistId(item.id); // Lưu lại ID để xóa khi cần
      } else {
        setIsFavorite(false);
        setWishlistId(null);
      }
    } catch (error) {
      console.error("Lỗi kiểm tra yêu thích:", error);
    }
  };

  // 3. Hàm Thêm vào giỏ hàng
  const addToCart = async () => {
    try {
      await axios.post(`${BASE_URL}/cart/`, {
        book_id: book.id,
        user_id: USER_ID,
        quantity: 1
      });
      alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
    } catch (error) {
      alert("Không thể thêm vào giỏ hàng.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const bookRes = await axios.get(`${BASE_URL}/books/${id}`);
        setBook(bookRes.data);
        await fetchWishlistStatus(); // Kiểm tra tim đỏ hay tim trắng
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Đang kết nối thư viện...</p>
      </div>
    );
  }

  if (!book) return <div className="text-center py-20 font-bold">Không tìm thấy sách!</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="group mb-6 flex items-center text-gray-600 hover:text-indigo-600 transition-colors font-medium">
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
        Quay lại danh sách
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        {/* Ảnh sách */}
        <div className="md:w-5/12 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
          <div className="relative w-full max-w-[350px] aspect-[3/4] rounded-lg shadow-2xl overflow-hidden bg-white">
            <img 
              src={`${BASE_URL}${book.image_url}`} 
              alt={book.title} 
              className="w-full h-full object-contain p-4"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=No+Image'; }}
            />
          </div>
        </div>

        {/* Thông tin sách */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">ID: {book.id}</span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${book.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {book.stock > 0 ? `Còn hàng: ${book.stock}` : 'Hết hàng'}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{book.title}</h1>
            <p className="text-xl text-gray-500 mb-6 italic">Tác giả: <span className="text-gray-800 font-semibold not-italic">{book.author}</span></p>

            <div className="text-4xl font-black text-indigo-600 mb-8">
              {book.price?.toLocaleString('vi-VN')} <span className="text-2xl font-normal">VNĐ</span>
            </div>
            
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
               <h3 className="text-lg font-bold text-indigo-900 mb-2">Giới thiệu tác phẩm</h3>
               <p className="text-gray-700 leading-relaxed italic">
                 "Cuốn sách này là một hành trình tri thức đầy thú vị của tác giả {book.author}, mang lại những góc nhìn sâu sắc cho người đọc."
               </p>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            {/* Nút Giỏ hàng */}
            <button 
              onClick={addToCart} 
              disabled={book.stock <= 0}
              className={`flex-1 py-5 rounded-2xl font-bold text-xl shadow-lg transition-all active:scale-95 text-white ${
                book.stock > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {book.stock > 0 ? "Thêm vào giỏ hàng" : "Đã hết hàng"}
            </button>
            
            {/* Nút Trái tim Toggle */}
            <button 
              onClick={toggleWishlist}
              className={`p-5 rounded-2xl transition-all duration-300 shadow-sm border-2 flex items-center justify-center ${
                isFavorite 
                ? 'bg-pink-50 border-pink-200 text-pink-500 scale-105 shadow-pink-100' 
                : 'bg-gray-100 border-transparent text-gray-400 hover:text-pink-400 hover:bg-pink-50'
              }`}
              title={isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
            >
              <span className="text-3xl leading-none">
                {isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;