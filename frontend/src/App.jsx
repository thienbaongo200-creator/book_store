import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Import các components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';

// PHẢI CÓ DÒNG NÀY:
import BookDetail from './pages/BookDetail'; 

function App() {
  const [search, setSearch] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar onSearch={(k) => setSearch(k)} />
        
        <Routes>
          <Route path="/" element={<Home searchTerm={search} />} />
          
          {/* Route cho trang chi tiết sách */}
          <Route path="/book/:id" element={<BookDetail />} />
          
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;