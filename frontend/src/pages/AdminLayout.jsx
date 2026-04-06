import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-black italic border-b border-gray-800">
          BOOK<span className="text-indigo-500">ADMIN</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/books" className="block px-4 py-3 rounded-xl hover:bg-indigo-600 transition-all font-bold">
            Quản lý sách
          </Link>
          <Link to="/admin/orders" className="block px-4 py-3 rounded-xl hover:bg-indigo-600 transition-all font-bold">
            Đơn hàng
          </Link>
          <Link to="/admin/users" className="block px-4 py-3 rounded-xl hover:bg-indigo-600 transition-all font-bold">
            Nguoi dung
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800 uppercase">Hệ thống quản trị</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500">Xin chào, {user?.username}</span>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
              B
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Outlet sẽ là nơi hiển thị trang Quản lý sách hoặc các trang con khác */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;