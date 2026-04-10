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
  const [hotBooks, setHotBooks] = useState([]); // Sách ngẫu nhiên toàn hệ thống
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [category, setCategory] = useState("");

  const BASE_URL = "http://127.0.0.1:8000";

  // --- 1. LẤY SÁCH HOT (NGẪU NHIÊN TỪ DB) ---
  const fetchHotBooks = async () => {
    try {
      // Gọi endpoint /books/random/ (Bạn cần thêm endpoint này ở Backend như mình hướng dẫn trước đó)
      const res = await axios.get(`${BASE_URL}/books/random/?limit=5`);
      setHotBooks(res.data);
    } catch (err) {
      console.error("Lỗi lấy sách Hot:", err);
    }
  };

  // --- 2. FETCH DATA CHÍNH (Sách & Danh mục) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [booksRes, catsRes] = await Promise.all([
        getBooks(searchTerm, page, limit, category),
        getCategories()
      ]);

      setBooks(booksRes.data.books || []);
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, category]);

  // Khởi tạo dữ liệu
  useEffect(() => {
    fetchHotBooks(); // Chỉ lấy sách ngẫu nhiên 1 lần khi load trang
  }, []);

  useEffect(() => {
    fetchData(); // Chạy lại khi search, đổi trang hoặc đổi danh mục
  }, [fetchData]);

  // --- 3. LOGIC GIỎ HÀNG ---
  const addToCart = async (bookId, title) => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!user) {
      alert("đăng nhập mới thêm vào giỏ hàng được nhé!");
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

  // --- 4. LOGIC CAROUSEL ---
  useEffect(() => {
    if (hotBooks.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev === hotBooks.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [hotBooks.length]);

  const prevSlide = () => setCurrentIndex(prev => prev === 0 ? hotBooks.length - 1 : prev - 1);
  const nextSlide = () => setCurrentIndex(prev => prev === hotBooks.length - 1 ? 0 : prev + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans transition-all duration-500">
      
      {/* --- SECTION 1: CAROUSEL SÁCH HOT --- */}
      {!searchTerm && page === 1 && hotBooks.length > 0 && (
        <div className="mb-16 relative group">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">
            Gợi ý <span className="text-red-500">Ngẫu Nhiên</span>
          </h2>
          
          <div className="relative h-[350px] md:h-[480px] w-full overflow-hidden rounded-[40px] shadow-2xl bg-gray-900">
            <div 
              className="flex h-full transition-transform duration-1000 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {hotBooks.map((book) => (
                <div key={`hot-${book.id}`} className="min-w-full h-full flex items-center relative overflow-hidden">
                   {/* Lớp nền mờ ảo */}
                   <img src={`${BASE_URL}${book.image_url}`} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-3xl scale-150" alt="" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-10 md:px-24 gap-12">
                    <img 
                      src={`${BASE_URL}${book.image_url}`} 
                      className="h-64 md:h-80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-xl transform -rotate-2 hover:rotate-0 transition-all duration-700"
                      alt={book.title}
                    />
                    <div className="text-white text-center md:text-left max-w-xl">
                      <span className="bg-indigo-600 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] mb-6 inline-block shadow-lg shadow-indigo-500/30">Hôm nay đọc gì?</span>
                      <h3 className="text-3xl md:text-5xl font-black mb-4 line-clamp-2 italic leading-tight">{book.title}</h3>
                      <p className="text-gray-300 text-lg font-medium mb-8 italic opacity-80">Tác giả: {book.author}</p>
                      <Link to={`/books/${book.id}`} className="bg-white text-gray-900 px-12 py-4 rounded-2xl font-black hover:bg-indigo-500 hover:text-white transition-all transform hover:-translate-y-1 inline-block shadow-xl">
                        XEM CHI TIẾT
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Điều hướng Carousel */}
            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-20 border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-20 border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* --- SECTION 2: TIÊU ĐỀ & BỘ LỌC --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">
            {searchTerm ? <span>Kết quả: <span className="text-indigo-600">"{searchTerm}"</span></span> : "Tiệm Sách"}
          </h2>
          <div className="h-1.5 w-24 bg-indigo-600 mt-2 rounded-full"></div>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 px-6 rounded-2xl border-2 border-gray-100 shadow-sm">
          <label className="font-black italic text-gray-400 uppercase text-[10px] tracking-widest">Lọc theo:</label>
          <select 
            value={category} 
            onChange={(e) => { setPage(1); setCategory(e.target.value); }}
            className="bg-transparent border-none text-gray-900 text-sm font-black rounded-2xl focus:ring-0 cursor-pointer outline-none"
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
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-6 text-gray-400 font-black italic animate-pulse tracking-widest">ĐANG TÌM SÁCH HAY...</p>
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-10">
            {books.map((book) => (
              <div key={book.id} className="group bg-white rounded-[40px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:-translate-y-3 transition-all duration-500 flex flex-col border border-gray-100">
                <Link to={`/books/${book.id}`} className="flex-1">
                  <div className="h-72 bg-gray-50 flex items-center justify-center relative p-8 overflow-hidden">
                    <img
                      src={`${BASE_URL}${book.image_url}`}
                      alt={book.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 shadow-lg"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'; }}
                    />
                    {book.stock <= 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-rose-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg">Hết hàng</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="font-black text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors italic leading-snug h-12 text-lg">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.1em] mb-4">
                      {book.author}
                    </p>
                  </div>
                </Link>

                <div className="px-8 pb-8 flex flex-col items-center gap-4 mt-auto">
                  <span className="text-gray-900 font-black text-2xl tracking-tighter">
                    {book.price?.toLocaleString('vi-VN')} <span className="text-sm">đ</span>
                  </span>
                  <button
                    disabled={book.stock <= 0}
                    onClick={() => addToCart(book.id, book.title)}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center text-white font-black shadow-lg active:scale-95 transition-all gap-2 ${
                      book.stock > 0 
                      ? 'bg-gray-900 hover:bg-indigo-600 shadow-indigo-100 hover:shadow-indigo-200' 
                      : 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    {book.stock > 0 ? "THÊM VÀO GIỎ" : "TẠM HẾT"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- PHÂN TRANG --- */}
          <div className="flex justify-center mt-24 gap-6">
            <button
              onClick={() => { setPage(p => p - 1); window.scrollTo({top: 500, behavior: 'smooth'}); }}
              disabled={page === 1}
              className="px-10 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black hover:bg-indigo-600 hover:text-white disabled:opacity-20 transition-all shadow-sm"
            >
              LÙI LẠI
            </button>
            <div className="flex items-center px-10 bg-gray-900 text-white rounded-2xl font-black shadow-xl italic tracking-widest">
              TRANG {page}
            </div>
            <button
              onClick={() => { setPage(p => p + 1); window.scrollTo({top: 500, behavior: 'smooth'}); }}
              disabled={books.length < limit}
              className="px-10 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black hover:bg-indigo-600 hover:text-white disabled:opacity-20 transition-all shadow-sm"
            >
              TIẾP THEO
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-40 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-200">
          <p className="text-gray-400 text-2xl font-black italic">Hết sách này rồi, tìm cuốn khác nhé! 📚</p>
          <button onClick={() => window.location.href = '/'} className="mt-8 px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200">
            XEM TẤT CẢ SÁCH
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;