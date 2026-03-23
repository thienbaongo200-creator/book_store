import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook, createBook } from '../services/api';

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm tải danh sách sách từ database
  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Hàm xóa sách
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      await deleteBook(id);
      fetchBooks(); // Tải lại danh sách sau khi xóa
    }
  };

  if (loading) return <div className="p-10 text-center">Đang kết nối Database...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Kho Sách (MySQL)</h1>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 shadow-md">
            + Thêm sách
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-50 text-indigo-900 text-sm">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Tiêu đề</th>
              <th className="p-4 text-left">Tác giả</th>
              <th className="p-4 text-left">Giá</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">#{book.id}</td>
                <td className="p-4 font-medium">{book.title}</td>
                <td className="p-4 text-gray-600">{book.author}</td>
                <td className="p-4 text-indigo-600 font-bold">{book.price.toLocaleString()}đ</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(book.id)} className="text-red-500 hover:text-red-700 font-medium">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;