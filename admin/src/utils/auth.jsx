// src/utils/auth.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ADMIN_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "admin2080"
};

export const checkAdminCredentials = (email, password) => {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
};

export const checkAdminStatus = () => {
  return localStorage.getItem('admin-token') === 'authenticated';
};

export const adminLogin = () => {
  localStorage.setItem('admin-token', 'authenticated');
};

export const adminLogout = () => {
  localStorage.removeItem('admin-token');
  window.location.href = '/admin/login';
};

// ✅ withAdminAuth HOC
export const withAdminAuth = (Component) => {
  return function WrappedComponent(props) {
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const status = checkAdminStatus();
      if (!status) navigate('/admin/login');
      setIsAdmin(status);
    }, []);

    if (isAdmin === null) {
      return <div className="admin-loading">Loading...</div>;
    }

    return isAdmin ? <Component {...props} /> : null;
  };
};
