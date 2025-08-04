import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './OrderDetails.css';
const API = import.meta.env.VITE_API_BASE_URL;

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API}/order-details/${orderId}`, {
          headers: {
            'auth-token': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <FaBox className="text-blue-500" />;
      case 'shipped': return <FaShippingFast className="text-purple-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaBox className="text-yellow-500" />;
    }
  };

  if (loading) return <div className="p-4 text-center">Loading order details...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (!order) return <div className="p-4 text-center">Order not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Orders
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">Order #{order._id.substring(0, 8).toUpperCase()}</h2>
          <div className="flex items-center">
            {getStatusIcon(order.status)}
            <span className="ml-2 capitalize">{order.status}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Shipping Information</h3>
            <p>{order.shippingAddress}</p>
            <p className="mt-2">Phone: {order.phoneNumber}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Payment Information</h3>
            <p>Method: {order.paymentMethod?.toUpperCase()}</p>
            {order.transactionId && <p>Transaction ID: {order.transactionId}</p>}
            <p>Status: {order.paymentStatus}</p>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-3">Order Items</h3>
        <div className="space-y-4 mb-6">
          {order.items.map((item, index) => (
            <div key={index} className="flex border-b pb-4">
              <img 
                src={item.image || '/placeholder-product.jpg'} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded mr-4"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">Size: {item.size || 'N/A'}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p>৳{(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-600">৳{item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>৳{order.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>৳{order.shipping?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>৳{order.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;