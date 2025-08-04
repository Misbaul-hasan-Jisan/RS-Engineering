import React, { useEffect, useState } from "react";
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";
import './MyOrder.css';
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/my-orders`, {
          headers: {
            "auth-token": token,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FaBox className="icon processing" />;
      case 'shipped':
        return <FaShippingFast className="icon shipped" />;
      case 'delivered':
        return <FaCheckCircle className="icon delivered" />;
      case 'cancelled':
        return <FaTimesCircle className="icon cancelled" />;
      default:
        return <FaBox className="icon pending" />;
    }
  };

  const getPaymentStatusBadge = (paymentStatus, paymentMethod) => {
    if (paymentMethod === 'cod') {
      return <span className="badge cod">Cash on Delivery</span>;
    }

    switch (paymentStatus) {
      case 'verified':
        return <span className="badge verified">Payment Verified</span>;
      case 'failed':
        return <span className="badge failed">Payment Failed</span>;
      default:
        return <span className="badge pending">Payment Pending</span>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error-message">
          <p>Error loading orders: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2><FaBox className="header-icon" /> My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/")} className="shop-now-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <h3>Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.status)}
                  <span className={`status-text ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="order-payment">
                {getPaymentStatusBadge(order.paymentStatus, order.paymentMethod)}
                {order.transactionId && (
                  <p className="transaction-id">
                    <FaMoneyBillWave /> Txn: {order.transactionId}
                  </p>
                )}
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="item-image" 
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size || 'N/A'}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>৳{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-totals">
                  <p>Subtotal: ৳{order.subtotal?.toFixed(2)}</p>
                  <p>Shipping: ৳{order.shipping?.toFixed(2)}</p>
                  <p className="total">Total: ৳{order.total?.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => navigate(`/order-details/${order._id}`)}
                  className="view-details-btn"
                >
                  View Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;