import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Hiện mật khẩu chính
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Hiện mật khẩu xác nhận
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const BASE_URL = "http://127.0.0.1:8000";

    // Việt hóa thông báo trống
    const handleInvalid = (e) => {
        e.target.setCustomValidity("Vui lòng điền vào trường này");
    };

    const handleInput = (e) => {
        e.target.setCustomValidity("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/users/`, {
                username: username,
                password: password,
                role: "user"
            });
            alert("Chúc mừng bạn đã đăng ký thành công!");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.detail || "Đăng ký thất bại, tên đăng nhập có thể đã tồn tại!");
        } finally {
            setLoading(false);
        }
    };

    // Component icon con mắt để tái sử dụng
    const EyeIcon = ({ isVisible }) => (
        isVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    );

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">
                <h2 className="text-4xl font-black text-center text-gray-900 mb-2 italic">Join Us<span className="text-indigo-600">.</span></h2>
                <p className="text-center text-gray-400 mb-10 font-medium">Tạo tài khoản để bắt đầu mua sắm</p>
                
                <form onSubmit={handleRegister} className="space-y-5">
                    {/* USERNAME */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                        <input 
                            type="text" required 
                            onInvalid={handleInvalid}
                            onInput={handleInput}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
                            placeholder="Ví dụ: Nguyen Van A" 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            onInvalid={handleInvalid}
                            onInput={handleInput}
                            minLength={6}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold pr-14" 
                            placeholder="Tối thiểu 6 ký tự" 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-[42px] text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            <EyeIcon isVisible={showPassword} />
                        </button>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            required 
                            onInvalid={handleInvalid}
                            onInput={handleInput}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold pr-14" 
                            placeholder="Nhập lại mật khẩu" 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-5 top-[42px] text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            <EyeIcon isVisible={showConfirmPassword} />
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 text-white mt-4 ${loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-indigo-600'}`}
                    >
                        {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN NGAY"}
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