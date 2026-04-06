import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  // 1. Lấy thông tin User
  const getLoggedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  };

  // 2. Fetch giỏ hàng theo User ID
  const fetchCart = async () => {
    const user = getLoggedUser();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Gọi đúng endpoint có user.id để tránh lỗi 405
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

  // 3. Xóa item khỏi giỏ hàng
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

  // 4. Xử lý thanh toán (Đã gộp lại làm 1 hàm duy nhất)
  const handleCheckout = async () => {
    const user = getLoggedUser();
    if (!user || cartItems.length === 0) return;

    if (window.confirm("Bạn xác nhận thanh toán đơn hàng này?")) {
      setIsProcessing(true);
      try {
        const response = await axios.post(`${BASE_URL}/orders/${user.id}`);
        
        if (response.status === 200) {
          alert(`🎉 Thanh toán thành công!\nMã đơn hàng: ${response.data.order_id}\nTổng tiền: ${response.data.total.toLocaleString()}đ`);
          setCartItems([]);
          navigate("/orders"); 
        }
      } catch (error) {
        console.error("Lỗi thanh toán:", error);
        alert(error.response?.data?.detail || "Thanh toán thất bại, vui lòng thử lại!");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-opacity-50"></div>
      <p className="mt-4 text-gray-500 font-bold animate-pulse">Đang kiểm tra giỏ hàng của bạn...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          Giỏ hàng <span className="text-indigo-600">.</span>
        </h2>
        <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-bold text-sm">
          {cartItems.length} sản phẩm
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-6">🛒</div>
          <p className="text-gray-500 text-xl font-bold mb-8">Giỏ hàng của bạn đang trống không</p>
          <Link to="/" className="inline-block px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1">
            TIẾP TỤC MUA SẮM
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* DANH SÁCH SÁCH */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex border border-gray-100 p-5 items-center">
                <div className="w-24 h-36 bg-gray-50 flex items-center justify-center rounded-2xl flex-shrink-0 border border-gray-50 overflow-hidden">
                  <img 
                    src={`${BASE_URL}${item.book.image_url}`} 
                    alt={item.book.title} 
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'; }}
                  />
                </div>

                <div className="ml-8 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-gray-900 text-xl line-clamp-1 mb-1 italic">
                        {item.book.title}
                      </h3>
                      <p className="text-sm text-indigo-500 font-bold uppercase tracking-widest mb-4">
                        {item.book.author}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-2"
                      title="Xóa sản phẩm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl">
                        <span className="text-xs font-bold text-gray-400 uppercase">Số lượng</span>
                        <span className="font-black text-gray-900">{item.quantity}</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 tracking-tighter">
                      {(item.book.price * item.quantity)?.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG KẾT ĐƠN HÀNG */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 text-white rounded-[40px] p-10 shadow-2xl sticky top-24 border border-gray-800">
              <h3 className="text-2xl font-black mb-8 italic">Thanh toán đơn hàng</h3>
              
              <div className="space-y-5 border-b border-gray-800 pb-8 mb-8">
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Tạm tính</span>
                  <span className="text-white">{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Miễn phí 🚚</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-10">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Tổng cộng</span>
                <span className="text-4xl font-black text-indigo-400 tracking-tighter">{subtotal.toLocaleString()}đ</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 flex justify-center items-center ${
                  isProcessing 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-gray-900 hover:bg-indigo-400 hover:text-white'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                    ĐANG XỬ LÝ...
                  </>
                ) : "THANH TOÁN NGAY"}
              </button>
              
              <p className="text-center text-[10px] text-gray-500 mt-6 font-bold uppercase tracking-widest">
                Đảm bảo an toàn 100% bởi Team Bảo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;