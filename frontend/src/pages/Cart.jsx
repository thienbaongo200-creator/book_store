import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái đang thanh toán
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";
  const USER_ID = 1; // Giả định ID người dùng là 1

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cart/`);
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (itemId) => {
    if (window.confirm("Xóa cuốn sách này khỏi giỏ hàng?")) {
      try {
        await axios.delete(`${BASE_URL}/cart/${itemId}`);
        setCartItems(cartItems.filter(item => item.id !== itemId));
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  // Hàm xử lý thanh toán
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (window.confirm("Bạn xác nhận thanh toán đơn hàng này?")) {
      setIsProcessing(true);
      try {
        // Gọi API tạo đơn hàng (Backend của Bảo đã có logic xóa giỏ hàng trong này)
        const response = await axios.post(`${BASE_URL}/orders/${USER_ID}`);
        
        if (response.status === 200) {
          alert(`🎉 Thanh toán thành công!\nMã đơn hàng: ${response.data.order_id}\nTổng tiền: ${response.data.total.toLocaleString()}đ`);
          
          // Xóa sạch state giỏ hàng ở Frontend
          setCartItems([]);
          
          // Chuyển hướng về trang chủ sau 1 giây
          setTimeout(() => {
            navigate("/");
          }, 1000);
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
    <div className="flex flex-col justify-center items-center h-80">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-10 border-b pb-4">
        Giỏ hàng của bạn
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-xl font-medium mb-6">Giỏ hàng của bạn đang trống</p>
          <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
            Quay lại mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* DANH SÁCH SÁCH */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex border border-gray-100 p-4">
                <div className="w-32 h-44 bg-gray-50 flex items-center justify-center relative overflow-hidden rounded-xl flex-shrink-0">
                  <img 
                    src={`${BASE_URL}${item.book.image_url}`} 
                    alt={item.book.title} 
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover'; }}
                  />
                </div>

                <div className="ml-6 flex-1 flex flex-col justify-between py-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight mb-1">
                      {item.book.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter mb-2">
                      {item.book.author}
                    </p>
                    <div className="text-indigo-600 font-black text-xl">
                      {item.book.price?.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                      Số lượng: {item.quantity}
                    </span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 font-bold text-sm transition-colors p-2"
                    >
                      Xóa khỏi giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG KẾT ĐƠN HÀNG */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4 border-b pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-semibold">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 mb-8">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-2xl font-black text-indigo-600">{subtotal.toLocaleString()}đ</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 flex justify-center items-center ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Đang xử lý...
                  </>
                ) : "Tiến hành thanh toán"}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;