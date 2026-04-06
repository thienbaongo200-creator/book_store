import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hàm gọi API lấy danh sách đơn hàng (Bảo thay URL cho đúng với Backend nhé)
        const fetchOrders = async () => {
    try {
        // Lấy thông tin user từ localStorage để lấy role
        const user = JSON.parse(localStorage.getItem("user"));
        
        const response = await axios.get("http://127.0.0.1:8000/admin/orders/", {
            headers: { 
                // Gửi đúng Header mà Backend đang chờ (x-user-role)
                "x-user-role": user?.role 
            }
        });
        setOrders(response.data);
    } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
    } finally {
        setLoading(false);
    }
    };
        fetchOrders();
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-tight">
                Quản lý Đơn hàng
            </h2>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-100 text-gray-400 text-xs uppercase tracking-widest">
                                <th className="pb-4 font-black">Mã Đơn</th>
                                <th className="pb-4 font-black">Khách hàng</th>
                                <th className="pb-4 font-black">Ngày đặt</th>
                                <th className="pb-4 font-black">Tổng tiền</th>
                                <th className="pb-4 font-black">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 font-bold text-indigo-600">#{order.id}</td>
                                
                                {/* Sửa lại từ order.username thành order.owner.username */}
                                <td className="py-4 font-medium">
                                    {order.owner ? order.owner.username : "N/A"}
                                </td>
                                
                                <td className="py-4 text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-4 font-black text-gray-900">
                                    {order.total_price.toLocaleString()}đ
                                </td>
                                <td className="py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-black bg-yellow-100 text-yellow-600">
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;