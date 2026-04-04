import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";
  const USER_ID = 1; // Giả định người dùng ID 1

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/${USER_ID}`);
        // Backend trả về danh sách order, chúng ta đảo ngược để cái mới nhất lên đầu
        setOrders(response.data.reverse());
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-80">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-900">Lịch sử đơn hàng</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Tiếp tục mua sắm →
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border shadow-sm">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-xl">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header của đơn hàng */}
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Mã đơn hàng:</span>
                  <span className="ml-2 font-bold text-gray-800">#ORD-{order.id}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Ngày đặt:</span>
                  <span className="font-medium text-gray-700">
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Danh sách sản phẩm trong đơn (Nếu backend trả về chi tiết) */}
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trạng thái thanh toán</p>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                      Thành công
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Tổng thanh toán</p>
                    <p className="text-2xl font-black text-indigo-600">
                      {order.total?.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;