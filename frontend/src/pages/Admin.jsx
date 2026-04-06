import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  // State cho file ảnh mới
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 50;

  const [formData, setFormData] = useState({
    title: "", author: "", price: 0, stock: 10, description: "", category_id: 1
  });

  const BASE_URL = "http://127.0.0.1:8000";

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString || "{}");
    return { 
        "Authorization": `Bearer ${token}`,
        "X-User-Role": user.role || "user" 
    };
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const config = {
        params: { page: currentPage, limit: itemsPerPage, search: searchTerm },
        headers: getAuthHeader() 
      };

      const [booksRes, catsRes] = await Promise.all([
        axios.get(`${BASE_URL}/books/`, config),
        axios.get(`${BASE_URL}/categories/`)
      ]);

      if (booksRes.data && booksRes.data.books) {
        setBooks(booksRes.data.books);
        setTotalPages(booksRes.data.total_pages || 1);
      } else {
        const data = Array.isArray(booksRes.data) ? booksRes.data : [];
        setBooks(data);
        setTotalPages(1);
      }
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : []);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : `ID: ${id}`;
  };

  const handleAddClick = () => {
    setEditingBook(null);
    setSelectedFile(null); // Reset file
    setFormData({ 
      title: "", author: "", price: 0, stock: 10, description: "", 
      category_id: categories[0]?.id || 1 
    });
    setShowModal(true);
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setSelectedFile(null); // Reset file khi mở form sửa
    setFormData({ 
      title: book.title, 
      author: book.author, 
      price: book.price, 
      stock: book.stock, 
      description: book.description || "", 
      category_id: book.category_id 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bảo có chắc chắn muốn xóa cuốn sách này không?")) {
      try {
        await axios.delete(`${BASE_URL}/books/${id}`, { headers: getAuthHeader() });
        alert("Xóa thành công!");
        fetchData();
      } catch (err) { 
        alert(err.response?.status === 403 ? "Bạn không có quyền quản trị!" : "Lỗi khi xóa!"); 
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Sử dụng FormData để gửi file
    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    data.append("category_id", formData.category_id);
    
    // Chỉ đính kèm file nếu người dùng có chọn ảnh mới
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      const config = { 
        headers: { 
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data" // Bắt buộc khi gửi file
        } 
      };

      if (editingBook) {
        await axios.put(`${BASE_URL}/books/${editingBook.id}`, data, config);
        alert("Cập nhật thành công!");
      } else {
        if (!selectedFile) return alert("Vui lòng chọn ảnh cho sách mới!");
        await axios.post(`${BASE_URL}/books/`, data, config);
        alert("Thêm sách mới thành công!");
      }
      
      setShowModal(false);
      setSelectedFile(null);
      fetchData();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.detail || "Vui lòng kiểm tra lại!"));
    }
  };

  if (loading && books.length === 0) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 italic">Quản lý Kho Sách<span className="text-indigo-600">.</span></h1>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">Admin: {localStorage.getItem("username") || "Bảo"}</p>
            <div className="mt-4">
              <input 
                type="text" 
                placeholder="Tìm tên sách..." 
                className="pl-4 pr-10 py-3 rounded-xl border-none shadow-inner bg-white w-64 focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          <button onClick={handleAddClick} className="bg-gray-900 text-white px-8 py-4 rounded-[20px] font-black shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-2">
            <span className="text-2xl">+</span> THÊM SÁCH MỚI
          </button>
        </div>

        {/* Bảng danh sách */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900 text-white uppercase text-[10px] tracking-[0.2em] font-black">
                  <th className="p-6">Thông tin sách</th>
                  <th className="p-6">Tác giả</th>
                  <th className="p-6">Thể loại</th>
                  <th className="p-6">Giá & Kho</th>
                  <th className="p-6 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                          <img 
                            src={book.image_url?.startsWith('http') ? book.image_url : `${BASE_URL}${book.image_url}`} 
                            alt={book.title} 
                            className="w-full h-full object-cover" 
                            onError={(e) => e.target.src = "https://via.placeholder.com/150x200?text=No+Img"} 
                          />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 group-hover:text-indigo-600">#{book.id} - {book.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Mã: {book.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-gray-600 font-bold italic">{book.author}</td>
                    <td className="p-6">
                      <span className="text-indigo-600 font-black text-xs uppercase">{getCategoryName(book.category_id)}</span>
                    </td>
                    <td className="p-6">
                      <div className="font-black text-gray-900">{book.price.toLocaleString()}đ</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{book.stock} bản</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEditClick(book)} className="bg-gray-100 hover:bg-emerald-500 hover:text-white p-2 rounded-lg transition-all font-bold text-xs px-3">SỬA</button>
                        <button onClick={() => handleDelete(book.id)} className="bg-gray-100 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all font-bold text-xs px-3">XÓA</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 relative">
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 text-2xl font-black">✕</button>
              <h2 className="text-3xl font-black italic mb-8">{editingBook ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">Tiêu đề sách</label>
                  <input type="text" required className="w-full px-6 py-4 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">Tác giả</label>
                  <input type="text" required className="w-full px-6 py-4 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border-none" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">Thể loại</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 font-bold border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Phần chọn file ảnh mới thay cho đường dẫn */}
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                    {editingBook ? "Thay đổi ảnh bìa (Để trống nếu giữ nguyên)" : "Tải ảnh bìa lên"}
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                    onChange={(e) => setSelectedFile(e.target.files[0])} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">Giá bán (VNĐ)</label>
                  <input type="number" required className="w-full px-6 py-4 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border-none" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">Số lượng kho</label>
                  <input type="number" required className="w-full px-6 py-4 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border-none" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">Mô tả sách</label>
                  <textarea rows="3" className="w-full px-6 py-4 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <button type="submit" className="col-span-2 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all mt-4 shadow-lg shadow-indigo-200">
                  {editingBook ? "CẬP NHẬT DỮ LIỆU" : "XÁC NHẬN THÊM MỚI"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;