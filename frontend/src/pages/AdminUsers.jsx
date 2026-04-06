import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
    const [editingId, setEditingId] = useState(null);

    const adminRole = JSON.parse(localStorage.getItem("user"))?.role;

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/admin/users/", {
                headers: { "x-user-role": adminRole }
            });
            setUsers(response.data);
        } catch (err) {
            alert("Lỗi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // Xử lý Thêm hoặc Cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://127.0.0.1:8000/admin/users/${editingId}`, formData, {
                    headers: { "x-user-role": adminRole }
                });
            } else {
                await axios.post("http://127.0.0.1:8000/admin/users/", formData, {
                    headers: { "x-user-role": adminRole }
                });
            }
            setFormData({ username: '', password: '', role: 'user' });
            setEditingId(null);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.detail || "Lỗi thao tác");
        }
    };

    // Xử lý Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bảo có chắc muốn xóa người dùng này không?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/admin/users/${id}`, {
                    headers: { "x-user-role": adminRole }
                });
                fetchUsers();
            } catch (err) {
                alert("Không thể xóa người dùng!");
            }
        }
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        setFormData({ username: user.username, password: user.password, role: user.role });
    };

    return (
        <div className="p-8 bg-white rounded-3xl shadow-sm">
            <h2 className="text-2xl font-black mb-6 uppercase">Quản lý Người dùng</h2>

            {/* Form Thêm/Sửa */}
            <form onSubmit={handleSubmit} className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl">
                <input 
                    className="border p-2 rounded-lg" placeholder="Tên đăng nhập" required
                    value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <input 
                    className="border p-2 rounded-lg" type="password" placeholder="Mật khẩu" required
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <select 
                    className="border p-2 rounded-lg"
                    value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button className="bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
                    {editingId ? "Cập nhật" : "Thêm mới"}
                </button>
            </form>

            {loading ? <p>Đang tải...</p> : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase border-b">
                            <th className="pb-4">Tên người dùng</th>
                            <th className="pb-4">Vai trò</th>
                            <th className="pb-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="py-4 font-medium">{user.username}</td>
                                <td className="py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 text-right space-x-4">
                                    <button onClick={() => startEdit(user)} className="text-indigo-600 font-bold">Sửa</button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-500 font-bold">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsers;