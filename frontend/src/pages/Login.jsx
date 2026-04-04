import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const BASE_URL = "http://127.0.0.1:8000";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            // Gửi request tới endpoint /login của FastAPI
            const response = await axios.post(`${BASE_URL}/login`, {
                username: username,
                password: password
            });

            if (response.data) {
                // Lưu object user {id, username, role} vào localStorage
                localStorage.setItem("user", JSON.stringify(response.data));
                alert(`Chào mừng ${response.data.username} quay trở lại!`);
                
                // Chuyển hướng về trang chủ
                navigate("/");
                // Reload nhẹ để Navbar cập nhật trạng thái Login/Logout
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Sai tài khoản hoặc mật khẩu!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">
                <h2 className="text-4xl font-black text-center text-gray-900 mb-2 italic">Login<span className="text-indigo-600">.</span></h2>
                <p className="text-center text-gray-400 mb-10 font-medium">Chào mừng quay trở lại!</p>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 font-bold text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                        <input 
                            type="text" required
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                            placeholder="Tên đăng nhập của bạn"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input 
                            type="password" required
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
                    >
                        {loading ? "ĐANG KIỂM TRA..." : "ĐĂNG NHẬP NGAY"}
                    </button>
                </form>
                <p className="text-center mt-10 text-gray-500 font-medium">
                    Chưa có tài khoản? <Link to="/register" className="text-indigo-600 font-black hover:underline">Đăng ký thành viên</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;