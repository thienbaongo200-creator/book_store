import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  const getLoggedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  };

  const fetchCart = async () => {
    const user = getLoggedUser();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/cart/${user.id}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- HÀM CẬP NHẬT SỐ LƯỢNG ---
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId); // Nếu giảm xuống 0 thì hỏi xóa
      return;
    }

    try {
      // Gọi API cập nhật quantity (Đảm bảo backend có endpoint PUT này)
      await axios.put(`${BASE_URL}/cart/${itemId}`, {
        quantity: newQuantity
      });

      // Cập nhật UI ngay lập tức
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      alert("Không thể cập nhật số lượng, có thể đã hết hàng trong kho!");
    }
  };

  const removeItem = async (itemId) => {
    if (window.confirm("Xóa cuốn sách này khỏi giỏ hàng?")) {
      try {
        await axios.delete(`${BASE_URL}/cart/${itemId}`);
        setCartItems(prev => prev.filter(item => item.id !== itemId));
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  const handleCheckout = async () => {
    const user = getLoggedUser();
    if (!user || cartItems.length === 0) return;

    if (window.confirm("Bạn xác nhận thanh toán đơn hàng này?")) {
      setIsProcessing(true);
      try {
        const response = await axios.post(`${BASE_URL}/orders/${user.id}`);
        if (response.status === 200) {
          alert(`Thanh toán thành công!\nMã đơn hàng: ${response.data.order_id}`);
          setCartItems([]);
          navigate("/orders");
        }
      } catch (error) {
        alert(error.response?.data?.detail || "Thanh toán thất bại!");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter">
          Giỏ hàng <span className="text-indigo-600">của Bảo</span>
        </h2>
        <span className="bg-indigo-600 text-white px-6 py-2 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100">
          {cartItems.length} MÓN
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-xl font-black italic mb-8 uppercase tracking-widest">Giỏ hàng trống trơn...</p>
          <Link to="/" className="inline-block px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all">
            QUAY LẠI CỬA HÀNG
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* DANH SÁCH SÁCH */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 flex border border-gray-100 p-6 items-center">
                <div className="w-28 h-40 bg-gray-50 flex items-center justify-center rounded-3xl overflow-hidden border border-gray-50">
                  <img 
                    src={`${BASE_URL}${item.book.image_url}`} 
                    alt={item.book.title} 
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="ml-8 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-gray-900 text-2xl line-clamp-1 mb-1 italic leading-tight">
                        {item.book.title}
                      </h3>
                      <p className="text-xs text-indigo-500 font-black uppercase tracking-[0.2em] mb-6">
                        {item.book.author}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-200 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* BỘ TĂNG GIẢM SỐ LƯỢNG */}
                    <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all font-black"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-black text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all font-black"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-2xl font-black text-gray-900 tracking-tighter italic">
                      {(item.book.price * item.quantity)?.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG KẾT ĐƠN HÀNG */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 text-white rounded-[50px] p-12 shadow-2xl sticky top-24">
              <h3 className="text-2xl font-black mb-8 italic uppercase tracking-widest border-b border-gray-800 pb-4">Tóm tắt</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                  <span>Tạm tính</span>
                  <span className="text-white text-lg font-black tracking-tighter">{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-800 pb-6">
                  <span>Phí Ship</span>
                  <span className="text-emerald-400 font-black italic">FREE TRỌN ĐỜI 🚚</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-black text-xs uppercase">Tổng tiền</span>
                  <span className="text-4xl font-black text-indigo-400 tracking-tighter">{subtotal.toLocaleString()}đ</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-6 rounded-3xl font-black text-xl shadow-2xl transition-all active:scale-95 ${
                  isProcessing 
                  ? 'bg-gray-800 text-gray-600' 
                  : 'bg-indigo-500 text-white hover:bg-white hover:text-indigo-600'
                }`}
              >
                {isProcessing ? "ĐANG GỬI ĐƠN..." : "THANH TOÁN NGAY"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;