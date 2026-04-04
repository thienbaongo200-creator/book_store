import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const BASE_URL = "http://127.0.0.1:8000";

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            // Gửi dữ liệu tới Backend (schemas.UserCreate)
            await axios.post(`${BASE_URL}/users/`, {
                username: username,
                password: password,
                role: "user" // Mặc định là user
            });
            alert("Chúc mừng đã đăng ký thành công!");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.detail || "Đăng ký thất bại, tên đăng nhập có thể đã tồn tại!");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">
                <h2 className="text-4xl font-black text-center text-gray-900 mb-2 italic">Join Us<span className="text-indigo-600">.</span></h2>
                <p className="text-center text-gray-400 mb-10 font-medium">Tạo tài khoản để bắt đầu mua sắm</p>
                
                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                        <input 
                            type="text" required 
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
                            placeholder="Ví dụ: Nguyen Van A" 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input 
                            type="password" required 
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
                            placeholder="Tối thiểu 6 ký tự" 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                        <input 
                            type="password" required 
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
                            placeholder="Nhập lại mật khẩu" 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-600 transition-all active:scale-95 mt-4">
                        TẠO TÀI KHOẢN NGAY
                    </button>
                </form>
                <p className="text-center mt-10 text-gray-500 font-medium">
                    Đã có tài khoản? <Link to="/login" className="text-indigo-600 font-black hover:underline">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;