import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi trực tiếp API lấy chi tiết 1 cuốn sách
    axios.get(`http://localhost:8000/books/${id}`)
      .then(res => {
        setBook(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Không tìm thấy sách", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-20">Đang tải thông tin...</div>;
  if (!book) return <div className="text-center py-20">Không tìm thấy sách này!</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 hover:underline flex items-center">
        ← Quay lại
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-sm border">
        {/* Ảnh sách */}
        <div className="aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xl">
          Ảnh bìa sách
        </div>

        {/* Thông tin chi tiết */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">Tác giả: <span className="font-medium">{book.author}</span></p>
          
          <div className="text-3xl font-extrabold text-indigo-600 mb-6">
            {book.price?.toLocaleString()}đ
          </div>

          <div className="border-t border-b py-6 my-6">
            <h3 className="font-bold mb-2">Giới thiệu sách:</h3>
            <p className="text-gray-700 leading-relaxed">
              {/* Nếu database bạn chưa có cột description, mình để mặc định tạm thời */}
              Cuốn sách "{book.title}" của tác giả {book.author} là một trong những tác phẩm nổi bật trong danh mục của chúng tôi. 
              Hiện tại cửa hàng còn {book.stock} cuốn.
            </p>
          </div>

          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;