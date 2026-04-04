import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu đơn hàng đang xem chi tiết
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

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
        const data = Array.isArray(response.data) ? response.data.reverse() : [];
        setOrders(data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally { setLoading(false); }
    };
    fetchOrders();
  }, [navigate]);

  // Hàm mở Modal và lấy chi tiết
  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) return <div className="text-center py-20 font-bold">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-black mb-10">Lịch sử mua hàng <span className="text-indigo-600">.</span></h2>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
              <span className="font-black text-indigo-400">#ORD-{order.id}</span>
              <span className="text-xs uppercase font-bold text-emerald-400">Thành công</span>
            </div>
            <div className="p-8 flex justify-between items-center">
               <div>
                  <p className="text-3xl font-black">{order.total?.toLocaleString()}đ</p>
                  <p className="text-gray-400 text-sm">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
               </div>
               <button 
                onClick={() => handleShowDetail(order)}
                className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-black hover:bg-indigo-600 hover:text-white transition-all"
               >
                 XEM CHI TIẾT
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL CHI TIẾT HÓA ĐƠN --- */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black italic">Hóa đơn <span className="text-indigo-600">.</span></h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Mã số: #ORD-{selectedOrder.id}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-gray-900 text-2xl font-black">✕</button>
              </div>

              <div className="space-y-6 border-y border-gray-100 py-8 my-8">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Trạng thái:</span>
                  <span className="font-black text-emerald-500 uppercase text-xs">Đã thanh toán</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Ngày đặt hàng:</span>
                  <span className="font-bold">{new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Hình thức:</span>
                  <span className="font-bold text-gray-900">Thanh toán Online</span>
                </div>
                <div className="pt-4 border-t border-dashed flex justify-between items-end">
                  <span className="text-gray-900 font-black text-xl">Tổng cộng:</span>
                  <span className="text-3xl font-black text-indigo-600 tracking-tighter">{selectedOrder.total?.toLocaleString()}đ</span>
                </div>
              </div>

              <button 
                onClick={() => window.print()} 
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
              >
                IN HÓA ĐƠN (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;