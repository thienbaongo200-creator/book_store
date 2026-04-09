import React, { useEffect, useState, useCallback } from 'react';
import { getBooks, getCategories } from '../services/api';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ searchTerm }) => {
  // --- STATE QUẢN LÝ ---
  const [page, setPage] = useState(1);
  const limit = 8;
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [hotBooks, setHotBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [category, setCategory] = useState("");

  const BASE_URL = "http://127.0.0.1:8000";

  // --- LOGIC GIỎ HÀNG ---
  const addToCart = async (bookId, title) => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!user) {
      alert("Bảo ơi, đăng nhập mới thêm vào giỏ hàng được nhé!");
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
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  // --- FETCH DATA (Sách & Danh mục) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [booksRes, catsRes] = await Promise.all([
        getBooks(searchTerm, page, limit, category),
        getCategories()
      ]);

      const booksData = booksRes.data.books || [];
      setBooks(booksData);
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : []);

      // Chỉ cập nhật Sách Hot khi ở trang 1 và không tìm kiếm
      if (!searchTerm && page === 1 && booksData.length > 0) {
        const shuffled = [...booksData].sort(() => 0.5 - Math.random());
        setHotBooks(shuffled.slice(0, 5));
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- LOGIC CAROUSEL (Tự động chạy) ---
  useEffect(() => {
    if (hotBooks.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev === hotBooks.length - 1 ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [hotBooks.length]);

  const prevSlide = () => setCurrentIndex(prev => prev === 0 ? hotBooks.length - 1 : prev - 1);
  const nextSlide = () => setCurrentIndex(prev => prev === hotBooks.length - 1 ? 0 : prev + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      
      {/* --- SECTION 1: CAROUSEL SÁCH HOT --- */}
      {!searchTerm && page === 1 && hotBooks.length > 0 && (
        <div className="mb-16 relative group">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">
            Sách đang <span className="text-red-500">HOT</span> nhất
          </h2>
          
          <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden rounded-[40px] shadow-2xl">
            <div 
              className="flex h-full transition-transform duration-700 ease-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {hotBooks.map((book) => (
                <div key={`hot-${book.id}`} className="min-w-full h-full flex items-center bg-gray-900 relative">
                   <img src={`${BASE_URL}${book.image_url}`} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl" alt="" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-10 md:px-20 gap-10">
                    <img 
                      src={`${BASE_URL}${book.image_url}`} 
                      className="h-56 md:h-80 shadow-2xl rounded-xl transform -rotate-3 hover:rotate-0 transition-all duration-500"
                      alt={book.title}
                    />
                    <div className="text-white text-center md:text-left max-w-lg">
                      <span className="bg-red-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">Best Seller</span>
                      <h3 className="text-2xl md:text-4xl font-black mb-2 line-clamp-2 italic">{book.title}</h3>
                      <p className="text-gray-400 font-bold mb-6 italic">{book.author}</p>
                      <Link to={`/books/${book.id}`} className="bg-white text-gray-900 px-10 py-4 rounded-full font-black hover:bg-indigo-500 hover:text-white transition-all inline-block shadow-lg">
                        XEM NGAY
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Điều hướng */}
            <button onClick={prevSlide} className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* --- SECTION 2: BỘ LỌC DANH MỤC --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight italic">
          {searchTerm ? <span>Kết quả cho: <span className="text-indigo-600">"{searchTerm}"</span></span> : "Khám phá tiệm sách"}
        </h2>
        
        <div className="flex items-center gap-4 bg-gray-50 p-3 px-5 rounded-3xl border border-gray-100 shadow-sm">
          <label className="font-black italic text-gray-500 uppercase text-xs tracking-widest">Danh mục :</label>
          <select 
            value={category} 
            onChange={(e) => { setPage(1); setCategory(e.target.value); }}
            className="bg-transparent border-none text-gray-900 text-sm font-bold rounded-2xl focus:ring-0 cursor-pointer outline-none"
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- SECTION 3: DANH SÁCH SÁCH --- */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-80">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-500 font-black italic">Đang tải sách cho Bảo...</p>
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <div key={book.id} className="group bg-white rounded-[35px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-gray-50">
                <Link to={`/books/${book.id}`} className="flex-1">
                  <div className="h-72 bg-gray-50 flex items-center justify-center relative p-6 overflow-hidden">
                    <img
                      src={`${BASE_URL}${book.image_url}`}
                      alt={book.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'; }}
                    />
                    {book.stock <= 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Hết hàng</div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-black text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors italic leading-tight h-10">
                      {book.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">
                      {book.author}
                    </p>
                  </div>
                </Link>

                <div className="px-6 pb-8 flex items-center justify-between mt-auto">
                  <span className="text-indigo-600 font-black text-xl tracking-tighter">
                    {book.price?.toLocaleString('vi-VN')}đ
                  </span>
                  <button
                    disabled={book.stock <= 0}
                    onClick={() => addToCart(book.id, book.title)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-all ${
                      book.stock > 0 ? 'bg-gray-900 hover:bg-indigo-600 shadow-indigo-100' : 'bg-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- PHÂN TRANG --- */}
          <div className="flex justify-center mt-20 gap-4">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all"
            >
              LÙI LẠI
            </button>
            <div className="flex items-center px-8 bg-gray-900 text-white rounded-2xl font-black">
              TRANG {page}
            </div>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={books.length < limit}
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all"
            >
              TIẾP THEO
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-xl font-black italic">Không tìm thấy sách phù hợp rồi Bảo ơi!</p>
          <button onClick={() => window.location.href = '/'} className="mt-6 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all">
            XEM TẤT CẢ SÁCH
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;