import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP + mật khẩu mới
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
            // Luôn chuyển step 2 dù email có tồn tại hay không (bảo mật)
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.detail || "Có lỗi xảy ra, thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (newPassword.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/auth/reset-password`, {
                email,
                otp_code: otp,
                new_password: newPassword
            });
            alert("Đặt lại mật khẩu thành công!");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.detail || "Mã OTP không đúng hoặc đã hết hạn!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">
                
                {/* STEP INDICATOR */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
                    <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
                </div>

                {step === 1 ? (
                    <>
                        <h2 className="text-4xl font-black text-center text-gray-900 mb-2 italic">
                            Forgot<span className="text-indigo-600">?</span>
                        </h2>
                        <p className="text-center text-gray-400 mb-10 font-medium">
                            Nhập email để nhận mã OTP đặt lại mật khẩu
                        </p>
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <input
                                    type="email" required
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                {loading ? "ĐANG GỬI..." : "GỬI MÃ OTP"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-4xl font-black text-center text-gray-900 mb-2 italic">
                            Reset<span className="text-indigo-600">.</span>
                        </h2>
                        <p className="text-center text-gray-400 mb-2 font-medium">
                            Kiểm tra email <strong className="text-indigo-600">{email}</strong>
                        </p>
                        <p className="text-center text-gray-400 mb-8 text-sm">
                            Mã OTP có hiệu lực trong 10 phút
                        </p>
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mã OTP (6 chữ số)</label>
                                <input
                                    type="text" required maxLength={6}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-2xl tracking-[0.5em] text-center"
                                    placeholder="······"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu mới</label>
                                <input
                                    type="password" required minLength={6}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                                    placeholder="Tối thiểu 6 ký tự"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password" required
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                {loading ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full py-3 text-gray-400 font-bold text-sm hover:text-indigo-600 transition-colors"
                            >
                                ← Đổi email khác
                            </button>
                        </form>
                    </>
                )}

                <p className="text-center mt-8 text-gray-500 font-medium">
                    <Link to="/login" className="text-indigo-600 font-black hover:underline">← Quay lại đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;