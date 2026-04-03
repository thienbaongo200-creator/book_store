import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://127.0.0.1:8000";

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/wishlist/`);
      setWishlist(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu thích:", error);
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      // Giả sử bạn có endpoint DELETE /wishlist/{id}
      await axios.delete(`${BASE_URL}/wishlist/${id}`);
      fetchWishlist(); // Tải lại danh sách
    } catch (error) {
      alert("Lỗi khi xóa khỏi danh sách yêu thích");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <span className="text-pink-500 mr-2">❤</span> Danh sách yêu thích của bạn
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <p className="text-gray-500 text-xl">Chưa có cuốn sách nào trong danh sách yêu thích.</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">
            Khám phá sách ngay →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative aspect-[3/4] bg-gray-50">
                <img 
                src={`${BASE_URL}${item.book?.image_url}`}  
                alt={item.book?.title} 
                className="w-full h-full object-contain p-4"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                />
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-500 hover:text-white rounded-full transition-colors text-red-500 shadow-sm"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate">{item.book?.title || "Sách không tồn tại"}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.book?.author}</p>
                <div className="flex items-center justify-between">
                <span className="text-indigo-600 font-bold">
                {item.book?.price?.toLocaleString()}đ
                </span>
                  <Link 
                    to={`/book/${item.book.id}`}
                    className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Xem chi tiết
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