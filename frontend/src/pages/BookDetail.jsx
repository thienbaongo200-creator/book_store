import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const BASE_URL = "http://127.0.0.1:8000";

  const getLoggedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/reviews/${id}`);
      setReviews(res.data);
      const user = getLoggedUser();
      if (user) {
        const alreadyReviewed = res.data.some(r => r.user_id === user.id);
        setHasReviewed(alreadyReviewed);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const user = getLoggedUser();

    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/reviews/`, {
        book_id: parseInt(id),
        user_id: user.id,
        rating: rating,
        comment: comment
      });
      alert("Cảm ơn bạn đã đánh giá!");
      setComment("");
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.detail || "Không thể gửi đánh giá.");
    }
  };

  const toggleWishlist = async () => {
    const user = getLoggedUser();
    if (!user) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/wishlist/toggle`, {
        book_id: parseInt(id),
        user_id: user.id
      });
      setIsFavorite(res.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWishlistStatus = async () => {
    const user = getLoggedUser();
    if (!user) return;
    try {
      const res = await axios.get(`${BASE_URL}/wishlist/${user.id}`);
      const item = res.data.find(fav => fav.book_id === parseInt(id));
      setIsFavorite(!!item);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async () => {
    const user = getLoggedUser();
    if (!user) {
      alert("Bạn cần đăng nhập để mua sách!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/cart/`, {
        book_id: book.id,
        user_id: user.id,
        quantity: 1
      });
      alert(`🎉 Đã thêm "${book.title}" vào giỏ hàng!`);
    } catch (error) {
      alert("Không thể thêm vào giỏ hàng.");
    }
  };

  // Logic tính toán thống kê đánh giá
  const ratingStats = (() => {
    if (reviews.length === 0) return { avg: 0, total: 0, distribution: [] };
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const distribution = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      return { star, count, percent: (count / reviews.length) * 100 };
    });
    return {
      avg: (sum / reviews.length).toFixed(1),
      total: reviews.length,
      distribution
    };
  })();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const bookRes = await axios.get(`${BASE_URL}/books/${id}`);
        setBook(bookRes.data);
        await Promise.all([fetchWishlistStatus(), fetchReviews()]);
      } catch (err) {
        console.error(err);
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
      {/* Nút quay lại */}
      <button onClick={() => navigate(-1)} className="group mb-6 flex items-center text-gray-600 hover:text-indigo-600 font-medium">
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
        Quay lại
      </button>

      {/* Card chi tiết sách */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50 flex flex-col md:flex-row">
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
                <div className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">Mô tả chi tiết</div>
                  <p className="text-gray-600 leading-relaxed italic">
                    {book.description || "Chưa có mô tả cho cuốn sách này."}
                  </p>
            </div>
          </div>

          <div className="flex gap-4">
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
            
            <button 
              onClick={toggleWishlist}
              className={`px-6 rounded-2xl transition-all duration-300 border-2 flex items-center justify-center hover:-translate-y-1 ${
                isFavorite 
                ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-lg shadow-rose-100' 
                : 'bg-white border-gray-100 text-gray-300 hover:border-rose-100 hover:text-rose-300'
              }`}
            >
              <span className="text-3xl">{isFavorite ? '❤️' : '♡'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PHẦN ĐÁNH GIÁ TỔNG QUAN */}
      <div className="mt-16 border-t border-gray-100 pt-12">
        <h2 className="text-3xl font-black text-gray-900 mb-8">Đánh giá từ độc giả</h2>
        
        <div className="flex flex-wrap items-center gap-8 mb-10 p-8 bg-gradient-to-r from-indigo-50 to-white rounded-3xl border border-indigo-100">
          <div className="text-center px-4">
            <div className="text-6xl font-black text-indigo-600 leading-none">{ratingStats.avg}</div>
            <div className="flex text-yellow-400 text-xl mt-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(ratingStats.avg) ? '★' : '☆'}</span>
              ))}
            </div>
            <p className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-tighter">{ratingStats.total} nhận xét</p>
          </div>

          <div className="flex-1 min-w-[280px] space-y-2 border-l border-gray-100 pl-8">
            {ratingStats.distribution.map((item) => (
              <div key={item.star} className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-600 w-12">{item.star} sao</span>
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400 w-8 font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lưới nhập đánh giá và danh sách đánh giá */}
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            {hasReviewed ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-emerald-700 font-bold flex items-center justify-center text-center">
                ✨ Bạn đã gửi đánh giá cho cuốn sách này.<br/>Cảm ơn bạn đã đóng góp ý kiến!
              </div>
            ) : (
              <form onSubmit={submitReview} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-inner">
                <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Gửi nhận xét của bạn</h3>
                
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Số sao (1-5)</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(num)}
                        className="text-3xl transition-all duration-200 transform hover:scale-125 focus:outline-none"
                      >
                        <span className={(hoverRating || rating) >= num ? "text-yellow-400" : "text-gray-300"}>
                          {(hoverRating || rating) >= num ? '★' : '☆'}
                        </span>
                      </button>
                    ))}
                    <span className="ml-3 text-sm font-bold text-gray-500 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">
                      {rating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Bình luận</label>
                  <textarea 
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết cảm nghĩ về sách..."
                    className="w-full p-4 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg">
                  GỬI ĐÁNH GIÁ
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
              </div>
            ) : (
              reviews.map((rev, index) => (
                <div key={index} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {rev.user_id}
                      </div>
                      <span className="font-bold text-gray-700 text-sm">Người dùng #{rev.user_id}</span>
                    </div>
                    <div className="flex text-yellow-400 text-lg">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="drop-shadow-sm">{i < rev.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">"{rev.comment}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;