import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaBox, 
  FaShippingFast, 
  FaCheckCircle, 
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBoxOpen,
  FaTruck,
  FaCheck,
  FaBan,
  FaPhone,
  FaMoneyBillWave
} from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';

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
    const baseClasses = "text-xl mr-2";
    switch (status) {
      case 'processing': 
        return <FiPackage className={`${baseClasses} text-blue-500`} />;
      case 'shipped': 
        return <FaTruck className={`${baseClasses} text-purple-500`} />;
      case 'delivered': 
        return <FaCheck className={`${baseClasses} text-green-500`} />;
      case 'cancelled': 
        return <FaBan className={`${baseClasses} text-red-500`} />;
      default: 
        return <FaBoxOpen className={`${baseClasses} text-yellow-500`} />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'processing': 
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Processing</span>;
      case 'shipped': 
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Shipped</span>;
      case 'delivered': 
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Delivered</span>;
      case 'cancelled': 
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
      default: 
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  const getPaymentBadge = (paymentStatus, paymentMethod) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    
    if (paymentMethod === 'cod') {
      return <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>Cash on Delivery</span>;
    }

    switch (paymentStatus) {
      case 'verified': 
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Payment Verified</span>;
      case 'failed': 
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Payment Failed</span>;
      default: 
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Payment Pending</span>;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaTimesCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading order details: {error}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  if (!order) return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p className="text-sm text-yellow-700">
          Order not found
        </p>
      </div>
      <button
        onClick={() => navigate('/my-orders')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Back to My Orders
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Order Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Order #{order._id.substring(0, 8).toUpperCase()}</h2>
              <p className="text-blue-100">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center">
              {getStatusIcon(order.status)}
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>

        {/* Order Content */}
        <div className="p-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Shipping Info */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center mb-3">
                <FaMapMarkerAlt className="text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Shipping Information</h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">{order.shippingAddress}</p>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2 text-sm" />
                  <span>{order.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center mb-3">
                <FaCreditCard className="text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Payment Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Method</p>
                  <p className="font-medium">{order.paymentMethod?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getPaymentBadge(order.paymentStatus, order.paymentMethod)}
                  </div>
                </div>
                {order.transactionId && (
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="mr-2 text-green-500" />
                      <span className="font-mono">{order.transactionId}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaBoxOpen className="mr-2 text-blue-500" />
              Order Items ({order.items.length})
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img 
                              className="h-full w-full object-cover rounded"
                              src={item.image || '/placeholder-product.jpg'} 
                              alt={item.name}
                              onError={(e) => {
                                e.target.src = '/placeholder-product.jpg';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">Size: {item.size || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ৳{item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">৳{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">৳{order.shipping?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-blue-600">৳{order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;