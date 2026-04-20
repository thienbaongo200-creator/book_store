import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    title: "", author: "", price: 0, stock: 10, description: "", category_id: ""
  });

  const BASE_URL = "http://127.0.0.1:8000";

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { "x-user-role": user.role || "admin" };
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [booksRes, catsRes] = await Promise.all([
        axios.get(`${BASE_URL}/books/`, {
          params: { page: currentPage, limit: itemsPerPage, search: searchTerm }
        }),
        axios.get(`${BASE_URL}/categories/`)
      ]);

      setBooks(booksRes.data.books || []);
      setTotalPages(booksRes.data.total_pages || 1);
      setCategories(catsRes.data || []);
      
      if (!editingBook && catsRes.data.length > 0 && !formData.category_id) {
        setFormData(prev => ({...prev, category_id: catsRes.data[0].id}));
      }
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, editingBook]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      description: book.description,
      category_id: book.category_id
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bảo có chắc muốn xóa cuốn sách này không?")) {
      try {
        await axios.delete(`${BASE_URL}/books/${id}/`, { headers: getAuthHeader() });
        alert("Xóa thành công!");
        fetchData();
      } catch (err) {
        alert("Lỗi khi xóa! Bảo kiểm tra lại Backend nhé.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (selectedFile) data.append("image", selectedFile);

    try {
      const config = { headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" } };
      if (editingBook) {
        await axios.put(`${BASE_URL}/books/${editingBook.id}/`, data, config);
        alert("Cập nhật thành công!");
      } else {
        if (!selectedFile) return alert("Bảo ơi, chọn ảnh cho sách đã!");
        await axios.post(`${BASE_URL}/books/`, data, config);
        alert("Thêm sách thành công!");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.detail || "Kiểm tra lại dữ liệu!"));
    }
  };

  const [importing, setImporting] = useState(false);
const [importResult, setImportResult] = useState(null);

const handleExport = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const link = document.createElement('a');
  link.href = `${BASE_URL}/admin/books/export`;
  link.setAttribute('download', 'danh_sach_sach.xlsx');
  // Gửi header role qua query param workaround (vì link thẻ <a> không gửi header được)
  // → Dùng fetch thay thế
  fetch(`${BASE_URL}/admin/books/export`, {
    headers: { 'x-user-role': user.role || 'admin' }
  })
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch(() => alert("Lỗi xuất file!"));
};

const handleImport = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setImporting(true);
  setImportResult(null);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post(`${BASE_URL}/admin/books/import`, formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
    });
    setImportResult({ success: true, data: res.data });
    fetchData(); // Reload bảng sách
  } catch (err) {
    setImportResult({ success: false, message: err.response?.data?.detail || "Lỗi nhập file!" });
  } finally {
    setImporting(false);
    e.target.value = ''; // Reset input file
  }
};
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER QUẢN LÝ */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Sách</h1>
          <p className="text-gray-500">Chào Bảo, hôm nay kho sách thế nào?</p>
        </div>
        <button 
          onClick={() => { setEditingBook(null); setShowModal(true); }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg transition-all"
        >
          + Thêm Sách Mới
        </button>
      </div>
      {/* PANEL NHẬP / XUẤT KHO */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
  <div>
    <h2 className="font-black text-gray-800 text-lg">Quản lý kho hàng</h2>
    <p className="text-gray-400 text-sm mt-0.5">Xuất danh sách sách ra Excel hoặc nhập tồn kho mới từ file</p>
  </div>

  <div className="flex gap-3 flex-wrap">
    {/* XUẤT KHO */}
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Xuất Excel
    </button>

    {/* NHẬP KHO */}
    <label className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md cursor-pointer ${importing ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}>
      {importing ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          Đang xử lý...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Nhập từ Excel
        </>
      )}
      <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} disabled={importing} />
    </label>
  </div>
</div>

{/* KẾT QUẢ NHẬP KHO */}
{importResult && (
  <div className={`mb-6 p-5 rounded-2xl border-l-4 ${importResult.success ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
    <p className={`font-black text-sm ${importResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
      {importResult.success ? '✓ ' + importResult.data.message : '✗ ' + importResult.message}
    </p>
    {importResult.success && importResult.data.not_found?.length > 0 && (
      <p className="text-amber-600 text-xs font-bold mt-1">
        ⚠ Không tìm thấy ID: {importResult.data.not_found.join(', ')}
      </p>
    )}
    {importResult.success && importResult.data.errors?.length > 0 && (
      <ul className="text-red-500 text-xs mt-1 space-y-0.5">
        {importResult.data.errors.map((e, i) => <li key={i}>• {e}</li>)}
      </ul>
    )}
    <button onClick={() => setImportResult(null)} className="mt-2 text-xs text-gray-400 hover:text-gray-600 font-bold">Đóng ×</button>
  </div>
)}
      {/* THANH TÌM KIẾM */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Tìm tên sách hoặc tác giả..." 
          className="w-full max-w-lg px-6 py-3 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* BẢNG DANH SÁCH SÁCH */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-5 font-bold text-gray-600">Bìa Sách</th>
              <th className="p-5 font-bold text-gray-600">Thông Tin</th>
              <th className="p-5 font-bold text-gray-600">Giá Bán</th>
              <th className="p-5 font-bold text-gray-600 text-center">Tồn Kho</th>
              <th className="p-5 font-bold text-gray-600 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400">Đang cập nhật kho...</td></tr>
            ) : books.map(book => (
              <tr key={book.id} className="border-b last:border-none hover:bg-indigo-50/30 transition">
                <td className="p-5">
                  <img 
                    src={book.image_url.startsWith('http') ? book.image_url : `${BASE_URL}${book.image_url}`} 
                    alt={book.title} 
                    className="w-14 h-20 object-cover rounded-xl shadow-sm border"
                  />
                </td>
                <td className="p-5">
                  <div className="font-bold text-gray-800">{book.title}</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{book.author}</div>
                </td>
                <td className="p-5 text-indigo-600 font-bold text-lg">
                  {book.price.toLocaleString()}đ
                </td>
                <td className="p-5 text-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${book.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {book.stock} cuốn
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(book)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition">Sửa</button>
                    <button onClick={() => handleDelete(book.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG */}
      <div className="flex justify-center mt-8 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-md scale-110' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODAL THÊM/SỬA SÁCH */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black text-gray-800 mb-6">{editingBook ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-sm font-bold text-gray-500 mb-2 block">Tên sách</label>
                <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-indigo-400" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 mb-2 block">Tác giả</label>
                <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-indigo-400" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 mb-2 block">Danh mục</label>
                <select className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-indigo-400" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 mb-2 block">Giá bán (VNĐ)</label>
                <input required type="number" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-indigo-400" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 mb-2 block">Số lượng</label>
                <input required type="number" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-indigo-400" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-bold text-gray-500 mb-2 block">Mô tả chi tiết</label>
                <textarea rows="3" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-indigo-400" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-bold text-gray-500 mb-2 block">Ảnh bìa</label>
                <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </div>
              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition">Hủy</button>
                <button type="submit" className="px-8 py-3 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;