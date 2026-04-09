import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState(null);
  
  // Đảm bảo BASE_URL không có dấu gạch chéo ở cuối để tránh bị dư (//)
  const BASE_URL = "http://127.0.0.1:8000";

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { "x-user-role": user.role || "admin" };
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Thêm dấu / vào cuối để tránh lỗi redirect 307 của FastAPI
      const res = await axios.get(`${BASE_URL}/categories/`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeader();
      
      if (editingCat) {
        // --- SỬA LỖI NOT FOUND Ở ĐÂY ---
        // Thêm dấu / ở cuối ID. URL đúng sẽ là: .../categories/5/
        await axios.put(`${BASE_URL}/categories/${editingCat.id}/`, 
          { name: newCatName }, 
          { headers }
        );
        alert("Cập nhật thành công!");
      } else {
        await axios.post(`${BASE_URL}/categories/`, 
          { name: newCatName }, 
          { headers }
        );
        alert("Thêm thành công!");
      }
      setNewCatName("");
      setEditingCat(null);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi chi tiết:", err.response?.data);
      alert("Lỗi: " + (err.response?.data?.detail || "Không tìm thấy địa chỉ API (404)"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bảo chắc chắn muốn xóa?")) {
      try {
        const headers = getAuthHeader();
        // --- SỬA LỖI NOT FOUND Ở ĐÂY ---
        // Thêm dấu / ở cuối ID để Backend nhận diện đúng Route
        await axios.delete(`${BASE_URL}/categories/${id}/`, { headers });
        alert("Đã xóa danh mục!");
        fetchCategories();
      } catch (err) {
        console.error("Lỗi khi xóa:", err.response?.data);
        alert("Lỗi xóa: " + (err.response?.data?.detail || "Kiểm tra lại Route Xóa"));
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 italic mb-10 uppercase tracking-tighter">
          Quản lý Danh Mục<span className="text-indigo-600">.</span>
        </h1>

        <div className="bg-white p-8 rounded-[30px] shadow-xl mb-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input 
              type="text" 
              className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border-2 border-transparent transition-all"
              placeholder={editingCat ? "Nhập tên mới..." : "Tên danh mục mới..."}
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              required
            />
            <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all uppercase text-sm">
              {editingCat ? "LƯU THAY ĐỔI" : "THÊM DANH MỤC"}
            </button>
            {editingCat && (
              <button 
                type="button" 
                onClick={() => {setEditingCat(null); setNewCatName("")}} 
                className="bg-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-black hover:bg-gray-300 transition-all text-sm"
              >
                HỦY
              </button>
            )}
          </form>
        </div>

        {/* ... (Phần Table giữ nguyên giao diện cũ của Bảo) ... */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-50">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900 text-white uppercase text-[11px] tracking-[0.2em] font-black">
                <th className="p-8">Mã ID</th>
                <th className="p-8">Tên hiển thị</th>
                <th className="p-8 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="3" className="p-20 text-center font-black italic text-gray-400">ĐANG TẢI...</td></tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-indigo-50/50 transition-colors group">
                  <td className="p-8 font-black text-gray-400">#{cat.id}</td>
                  <td className="p-8 font-bold text-gray-900 uppercase">{cat.name}</td>
                  <td className="p-8 text-center">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => {setEditingCat(cat); setNewCatName(cat.name)}} 
                        className="bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white p-3 rounded-xl font-black text-[10px] px-6 transition-all uppercase"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl font-black text-[10px] px-6 transition-all uppercase"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;