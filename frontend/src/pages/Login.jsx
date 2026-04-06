import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const BASE_URL = "http://127.0.0.1:8000";

    const handleInvalid = (e) => {
        e.target.setCustomValidity("Vui lòng điền vào trường này");
    };

    const handleInput = (e) => {
        e.target.setCustomValidity("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                username: username,
                password: password
            });

            if (response.data) {
                const userData = response.data;

                // 1. Lưu toàn bộ thông tin user
                localStorage.setItem("user", JSON.stringify(userData));
                
                // 2. Lưu Token
                const token = userData.access_token || userData.token;
                if (token) {
                    localStorage.setItem("token", token);
                }

                // 3. Lưu role và username để tiện kiểm tra nhanh
                localStorage.setItem("role", userData.role);
                localStorage.setItem("username", userData.username);

                alert(`Chào mừng ${userData.username} quay trở lại!`);

                // --- LOGIC ĐIỀU HƯỚNG QUAN TRỌNG ---
                if (userData.role === 'admin') {
                    // Nếu là Admin, đẩy thẳng vào trang dashboard
                    navigate("/admin");
                } else {
                    // Nếu là User thường, về trang chủ
                    navigate("/");
                }
                
                // Reload để cập nhật trạng thái Navbar/Sidebar nếu cần
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
                            onInvalid={handleInvalid}
                            onInput={handleInput}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                            placeholder="Tên đăng nhập của bạn"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            onInvalid={handleInvalid}
                            onInput={handleInput}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold pr-14"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-[42px] text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
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