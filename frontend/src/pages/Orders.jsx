import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  // Hàm format thời gian chuẩn Việt Nam (GMT+7)
  const formatVNTime = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLoggedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const user = getLoggedUser();
      if (!user) { navigate("/login"); return; }
      try {
        const response = await axios.get(`${BASE_URL}/orders/${user.id}`);
        const data = Array.isArray(response.data) ? response.data : [];
        // Sắp xếp đơn hàng mới nhất lên đầu
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(sortedData);
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black text-gray-900">Lịch sử mua hàng <span className="text-indigo-600">.</span></h2>
        <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
          ← Quay lại cửa hàng
        </button>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed">
            <p className="text-gray-400 font-bold">Bạn chưa có đơn hàng nào.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
                <span className="font-black text-indigo-400 tracking-wider">#ORD-{order.id}</span>
                <span className="text-[10px] uppercase font-black bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                  Thành công
                </span>
              </div>
              <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-3xl font-black text-gray-900">{order.total_price?.toLocaleString()}đ</p>
                  <p className="text-gray-400 text-sm font-medium">
                    {/* ÁP DỤNG MÚI GIỜ VIỆT NAM TẠI ĐÂY */}
                    {formatVNTime(order.created_at)}
                  </p>
                </div>
                <button 
                  onClick={() => handleShowDetail(order)}
                  className="w-full md:w-auto bg-indigo-50 text-indigo-600 px-8 py-3 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                >
                  CHI TIẾT ĐƠN HÀNG
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL CHI TIẾT HÓA ĐƠN --- */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black italic text-gray-900">Hóa đơn chi tiết</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Mã số: #ORD-{selectedOrder.id}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-red-500 transition-colors text-2xl font-black">✕</button>
              </div>

              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Sản phẩm trong đơn</p>
                {selectedOrder.items && selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.book?.image_url ? (
                            <img src={`${BASE_URL}${item.book.image_url}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl">📖</span>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm line-clamp-1">{item.book?.title || "Sách đã xóa"}</p>
                        <p className="text-xs text-gray-500 font-bold">x{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900 text-sm">
                      {(item.price_at_purchase * item.quantity).toLocaleString()}đ
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Thời gian đặt:</span>
                  <span className="font-bold text-gray-900">
                    {/* ÁP DỤNG MÚI GIỜ VIỆT NAM TRONG MODAL */}
                    {formatVNTime(selectedOrder.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-black text-xl italic">Tổng thanh toán:</span>
                  <span className="text-4xl font-black text-indigo-600 tracking-tighter">
                    {selectedOrder.total_price?.toLocaleString()}đ
                  </span>
                </div>
              </div>

              <button 
                onClick={() => window.print()} 
                className="w-full mt-10 py-5 bg-gray-900 text-white rounded-[24px] font-black shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                🖨️ XUẤT HÓA ĐƠN PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;