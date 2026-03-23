import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/api';
import { Link } from 'react-router-dom'; // Đảm bảo đã import Link

const Home = ({ searchTerm }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBooks(searchTerm)
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu sách:", err);
        setLoading(false);
      });
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 italic underline decoration-indigo-500">
        {searchTerm ? `Kết quả tìm kiếm cho: "${searchTerm}"` : "Sách đang bán tại tiệm"}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            /* BỌC TOÀN BỘ CARD BẰNG LINK ĐỂ NHẤN VÀO LÀ CHUYỂN TRANG */
            <Link 
              to={`/book/${book.id}`} 
              key={book.id} 
              className="bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* Hình ảnh bìa */}
              <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                <span className="text-gray-400 group-hover:scale-110 transition-transform duration-500">
                  Ảnh sách
                </span>
                {book.stock <= 0 && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1">
                    Hết hàng
                  </div>
                )}
              </div>

              {/* Thông tin nội dung */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-indigo-600 font-extrabold text-lg">
                    {book.price?.toLocaleString()}đ
                  </span>
                  
                  {/* Nút bấm giỏ hàng (vẫn giữ lại nhưng nhấn vào Card to vẫn ưu tiên chuyển trang chi tiết) */}
                  <button 
                    disabled={book.stock <= 0}
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn việc bị chuyển trang khi chỉ muốn bấm nút thêm vào giỏ
                      console.log("Thêm vào giỏ:", book.id);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
                      book.stock > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Rất tiếc, không tìm thấy cuốn sách nào phù hợp.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-indigo-600 hover:underline"
          >
            Xem tất cả sách
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;