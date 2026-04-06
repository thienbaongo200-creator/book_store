import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  // 1. Bảo vệ trang Admin
  const AdminRoute = ({ children }) => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser || savedUser.role !== "admin") {
      alert("Bạn không có quyền truy cập trang Quản trị!");
      return <Navigate to="/" />;
    }
    return children;
  };

  // 2. Bảo vệ trang cá nhân (Cart, Wishlist, Orders)
  const PrivateRoute = ({ children }) => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={(term) => setSearchTerm(term)} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Private Routes (Cần đăng nhập) */}
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;