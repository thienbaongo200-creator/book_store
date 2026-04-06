import React, { useEffect, useState, useRef } from 'react';
import { getBooks } from '../services/api';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ searchTerm }) => {
  const [page, setPage] = useState(1);
  const limit = 8;
  const [books, setBooks] = useState([]);
  const [hotBooks, setHotBooks] = useState([]); // Danh sách sách hot ngẫu nhiên
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Vị trí slide hiện tại
  
  const BASE_URL = "http://127.0.0.1:8000";

  // --- LOGIC GIỎ HÀNG ---
  const addToCart = async (bookId, title) => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!user) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/cart/`, {
        book_id: bookId,
        user_id: user.id,
        quantity: 1
      });
      alert(`Đã thêm "${title}" vào giỏ hàng!`);
    } catch (error) {
      alert("Không thể thêm vào giỏ hàng!");
    }
  };

  // --- FETCH DATA ---
  useEffect(() => {
    setLoading(true);
    getBooks(searchTerm, page, limit)
      .then((res) => {
        // LẤY DỮ LIỆU TỪ res.data.books THAY VÌ res.data
        const booksData = res.data.books || []; 
        setBooks(booksData);
        
        // Tạo danh sách sách HOT từ mảng booksData vừa lấy được
        if (!searchTerm && page === 1 && booksData.length > 0) {
          const shuffled = [...booksData].sort(() => 0.5 - Math.random());
          setHotBooks(shuffled.slice(0, 5));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setBooks([]); // Reset về mảng rỗng nếu lỗi
        setLoading(false);
      });
  }, [searchTerm, page]);

  // --- LOGIC CAROUSEL (Tự động lướt mỗi 3s) ---
  useEffect(() => {
    if (hotBooks.length > 0) {
      const timer = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, hotBooks]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === hotBooks.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? hotBooks.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* --- SECTION: SÁCH HOT (CAROUSEL) --- */}
      {!searchTerm && page === 1 && hotBooks.length > 0 && (
        <div className="mb-16 relative group">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
              Sách đang <span className="text-red-500">HOT</span> nhất
            </h2>
          </div>
          
          <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-[40px] shadow-2xl">
            {/* Slides Container */}
            <div 
              className="flex h-full transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {hotBooks.map((book) => (
                <div key={`hot-${book.id}`} className="min-w-full h-full flex items-center bg-gray-900 relative">
                   {/* Background Overlay mờ */}
                   <img 
                    src={`${BASE_URL}${book.image_url}`} 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl"
                    alt=""
                  />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-10 md:px-20 gap-10">
                    <img 
                      src={`${BASE_URL}${book.image_url}`} 
                      className="h-48 md:h-72 shadow-2xl rounded-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-500"
                      alt={book.title}
                    />
                    <div className="text-white text-center md:text-left max-w-lg">
                      <span className="bg-red-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Bán chạy nhất</span>
                      <h3 className="text-2xl md:text-4xl font-black mb-2 line-clamp-2">{book.title}</h3>
                      <p className="text-gray-400 font-bold mb-6 italic">{book.author}</p>
                      <Link 
                        to={`/books/${book.id}`}
                        className="bg-white text-gray-900 px-8 py-3 rounded-full font-black hover:bg-indigo-500 hover:text-white transition-all inline-block"
                      >
                        XEM CHI TIẾT
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Điều hướng Mũi tên */}
            <button 
              onClick={prevSlide}
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicators (Dấu chấm ở dưới) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {hotBooks.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- DANH SÁCH SÁCH CHÍNH --- */}
      <div className="flex items-center justify-between mb-10 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight italic">
          {searchTerm ? (
            <span>Kết quả cho: <span className="text-indigo-600">"{searchTerm}"</span></span>
          ) : (
            "Khám phá tiệm sách"
          )}
        </h2>
        <span className="text-gray-500 text-xs font-black bg-gray-100 px-4 py-2 rounded-full uppercase tracking-widest">
          {books.length} sản phẩm
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-80">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-500 font-black italic">Đang tìm sách cho Bảo...</p>
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {books.map((book) => (
              <div key={book.id} className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-gray-100 relative">
                <Link to={`/books/${book.id}`} className="flex-1 flex flex-col">
                  <div className="h-64 bg-gray-50 flex items-center justify-center relative overflow-hidden p-6">
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
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Hết hàng</div>
                    ) : book.stock < 5 ? (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Sắp hết</div>
                    ) : null}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-black text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors h-12 leading-tight italic">
                      {book.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mb-4 font-black uppercase tracking-[0.2em]">
                      {book.author}
                    </p>
                  </div>
                </Link>

                <div className="px-6 pb-6 flex items-center justify-between mt-auto">
                  <span className="text-indigo-600 font-black text-xl tracking-tighter">
                    {book.price?.toLocaleString('vi-VN')}đ
                  </span>
                  
                  <button
                    disabled={book.stock <= 0}
                    onClick={() => addToCart(book.id, book.title)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${
                      book.stock > 0 
                      ? 'bg-indigo-600 hover:bg-gray-900 shadow-indigo-100' 
                      : 'bg-gray-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PHÂN TRANG */}
          <div className="flex justify-center mt-16 space-x-3">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              TRƯỚC
            </button>
            <div className="flex items-center px-6 bg-gray-900 text-white rounded-2xl font-black">
              TRANG {page}
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={books.length < limit}
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              TIẾP
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-xl font-black italic">Không tìm thấy cuốn sách nào cho "{searchTerm}"</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-6 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all"
          >
            QUAY LẠI TẤT CẢ SÁCH
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;