import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';

function App() {
  // State lưu từ khóa tìm kiếm dùng chung cho toàn ứng dụng
  const [search, setSearch] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Truyền hàm setSearch vào Navbar để cập nhật từ khóa khi gõ */}
        <Navbar onSearch={(k) => setSearch(k)} />
        
        <Routes>
          {/* Truyền search vào Home để Home biết cần lọc sách nào */}
          <Route path="/" element={<Home searchTerm={search} />} />
          
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;