import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Địa chỉ Backend FastAPI của Bảo
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    // Gọi API lấy chi tiết sách
    axios.get(`${BASE_URL}/books/${id}`)
      .then(res => {
        setBook(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi lấy chi tiết sách:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Đang tải thông tin sách...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Rất tiếc! Không tìm thấy sách này.</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Trở về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate(-1)} 
        className="group mb-6 flex items-center text-gray-600 hover:text-indigo-600 transition-colors font-medium"
      >
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
        Quay lại danh sách
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* Bên trái: Khu vực ảnh bìa */}
        <div className="md:w-5/12 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
          <div className="relative group w-full max-w-[350px] aspect-[3/4] rounded-lg shadow-2xl overflow-hidden bg-white">
            {book.image_url ? (
              <img 
                src={`${BASE_URL}${book.image_url}`} 
                alt={book.title} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=No+Image'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 italic bg-gray-200">
                Chưa có ảnh bìa
              </div>
            )}
          </div>
        </div>

        {/* Bên phải: Thông tin chi tiết */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
                ID: {book.id}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Sẵn có: {book.stock} cuốn
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {book.title}
            </h1>
            
            <p className="text-xl text-gray-500 mb-6 italic">
              Tác giả: <span className="text-gray-800 font-semibold not-italic">{book.author}</span>
            </p>

            <div className="text-4xl font-black text-indigo-600 mb-8">
              {book.price?.toLocaleString('vi-VN')} <span className="text-2xl font-normal">VNĐ</span>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center">
                  📖 Giới thiệu tác phẩm
                </h3>
                <p className="leading-relaxed">
                  Cuốn sách <strong>"{book.title}"</strong> là một tài liệu giá trị được biên soạn bởi tác giả <strong>{book.author}</strong>. 
                  Hiện tại sản phẩm đang có sẵn {book.stock} bản tại nhà sách <strong>Team Bảo</strong>. 
                  Hãy nhanh tay đặt hàng để nhận được ưu đãi tốt nhất!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">
              Thêm vào giỏ hàng
            </button>
            <button className="p-5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors">
              ❤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;