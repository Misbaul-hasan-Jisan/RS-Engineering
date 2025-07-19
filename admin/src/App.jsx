import React, { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddProduct from './Components/AddProduct/AddProduct';
import ProductList from './Components/ProductList/ProductList';
import BulkUpload from './Components/BulkUpload/BulkUpload';
import Sidebar from './Components/Sidebar/Sidebar';
import AdminOrders from './Components/AdminOrder/AdminOrders';
import AdminLogin from './Pages/Admin/Login/AdminLogin';
import { withAdminAuth } from './utils/auth'; // ✅ updated path

// ✅ Wrap components with auth
const ProtectedAddProduct = withAdminAuth(AddProduct);
const ProtectedProductList = withAdminAuth(ProductList);
const ProtectedBulkUpload = withAdminAuth(BulkUpload);
const ProtectedAdminOrders = withAdminAuth(AdminOrders);

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={isSidebarOpen} onClose={closeSidebar} />

      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      <div className="main-content">
        <Navbar />
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/orders" element={<ProtectedAdminOrders />} />
            <Route path="/add-product" element={<ProtectedAddProduct />} />
            <Route path="/list-product" element={<ProtectedProductList />} />
            <Route path="/bulk-upload" element={<ProtectedBulkUpload />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
