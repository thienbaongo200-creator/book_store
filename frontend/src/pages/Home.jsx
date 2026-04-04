import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/api';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ searchTerm }) => {
  const [page, setPage] = useState(1);
  const limit = 8; 
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Địa chỉ Backend
  const BASE_URL = "http://127.0.0.1:8000";

  // --- PHẦN SỬA ĐỔI CHÍNH Ở ĐÂY ---
  const addToCart = async (bookId, title) => {
  // Lấy user từ localStorage giống như các trang khác
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  if (!user) {
    alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
    return;
  }

  try {
    await axios.post(`${BASE_URL}/cart/`, {
      book_id: bookId,
      user_id: user.id, // Dùng ID động ở đây
      quantity: 1
    });
    alert(`Đã thêm "${title}" vào giỏ hàng!`);
  } catch (error) {
    alert("Không thể thêm vào giỏ hàng!");
  }
};
  // --------------------------------

  useEffect(() => {
    setLoading(true);
    getBooks(searchTerm, page, limit)
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu sách:", err);
        setLoading(false);
      });
  }, [searchTerm, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-10 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {searchTerm ? (
            <span>Kết quả cho: <span className="text-indigo-600">"{searchTerm}"</span></span>
          ) : (
            "Sách đang bán tại tiệm"
          )}
        </h2>
        <span className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
          {books.length} sản phẩm
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-80">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-500 font-medium">Đang tìm sách cho Bảo...</p>
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {books.map((book) => (
              <div // Đổi từ Link sang div bao ngoài để tách biệt link và nút bấm
                key={book.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-gray-100 relative"
              >
                <Link to={`/books/${book.id}`} className="flex-1 flex flex-col">
                  <div className="h-64 bg-gray-50 flex items-center justify-center relative overflow-hidden p-4">
                    {book.image_url ? (
                      <img
                        src={`${BASE_URL}${book.image_url}`}
                        alt={book.title}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'; }}
                      />
                    ) : (
                      <div className="text-gray-300 italic text-sm">Chưa có ảnh</div>
                    )}
                    
                    {book.stock <= 0 ? (
                      <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Hết hàng</div>
                    ) : book.stock < 5 ? (
                      <div className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Sắp hết</div>
                    ) : null}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors h-12 leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-tighter">
                      {book.author}
                    </p>
                  </div>
                </Link>

                <div className="px-5 pb-5 flex items-center justify-between mt-auto">
                  <span className="text-indigo-600 font-black text-lg">
                    {book.price?.toLocaleString('vi-VN')}đ
                  </span>
                  
                  <button
                    disabled={book.stock <= 0}
                    onClick={() => addToCart(book.id, book.title)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all active:scale-90 ${
                      book.stock > 0 
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' 
                      : 'bg-gray-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="px-4 py-2 font-bold">Trang {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={books.length < limit}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Trang tiếp
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-xl font-medium">Không tìm thấy cuốn sách nào cho "{searchTerm}"</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-6 px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-50 font-bold transition-all"
          >
            Quay lại tất cả sách
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;