import React, { useState, useEffect } from 'react';
import './AdminOrders.css';
const API = import.meta.env.VITE_API_BASE_URL;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API}/all-orders`);
        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        
        // Apply both status and payment status filters
        const filtered = data.orders.filter(order => {
          const statusMatch = filter === 'all' || order.status === filter;
          const paymentStatusMatch = paymentStatusFilter === 'all' || 
                                  (order.paymentStatus === paymentStatusFilter) ||
                                  (paymentStatusFilter === 'cod' && order.paymentMethod === 'cod');
          return statusMatch && paymentStatusMatch;
        });

        setOrders(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter, paymentStatusFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, updating: true } : order
        )
      );

      const response = await fetch(`${API}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus, updating: false }
            : order
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: newStatus,
          updating: false
        }));
      }
    } catch (err) {
      setError(err.message);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, updating: false }
            : order
        )
      );
    }
  };

  const verifyPayment = async (orderId, status) => {
    try {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, paymentUpdating: true } : order
        )
      );

      const response = await fetch(`${API}/admin/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          orderId,
          status,
          notes: `Payment ${status} by admin`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify payment');
      }

      const updatedOrder = await response.json();

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, ...updatedOrder.order, paymentUpdating: false }
            : order
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          ...updatedOrder.order,
          paymentUpdating: false
        }));
      }
    } catch (err) {
      setError(err.message);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, paymentUpdating: false }
            : order
        )
      );
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Orders</h1>

      <div className="orders-section">
        <div className="filters">
          <div className="filter-group">
            <label>Order Status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Payment Status:</label>
            <select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)}>
              <option value="all">All Payments</option>
              <option value="pending">Pending Payment</option>
              <option value="verified">Verified Payment</option>
              <option value="failed">Failed Payment</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(0, 8)}</td>
                    <td>
                      {order.userId?.name || 'Guest'}
                      <br />
                      {order.userId?.email || ''}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td className={`payment-${order.paymentStatus || 'pending'}`}>
                      {order.paymentMethod === 'cod' ? 'COD' : (
                        <>
                          {order.paymentMethod?.toUpperCase() || 'N/A'}
                          <br />
                          {order.paymentStatus || 'Pending'}
                        </>
                      )}
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`status-${order.status}`}
                        disabled={order.updating}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="order-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
              &times;
            </button>

            <h2>Order Details #{selectedOrder._id.substring(0, 8)}</h2>

            <div className="order-details-grid">
              <div className="customer-info">
                <h3>Customer</h3>
                <p><strong>Name:</strong> {selectedOrder.userId?.name || 'Guest'}</p>
                <p><strong>Email:</strong> {selectedOrder.userId?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.phoneNumber || 'N/A'}</p>
              </div>

              <div className="shipping-info">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress || 'N/A'}</p>
              </div>

              <div className="payment-info">
                <h3>Payment</h3>
                <p><strong>Method:</strong> {selectedOrder.paymentMethod?.toUpperCase() || 'N/A'}</p>
                <p><strong>Status:</strong> 
                  <span className={`payment-status-${selectedOrder.paymentStatus}`}>
                    {selectedOrder.paymentStatus || 'Pending'}
                  </span>
                </p>
                {selectedOrder.transactionId && (
                  <p><strong>Transaction ID:</strong> {selectedOrder.transactionId}</p>
                )}
                {selectedOrder.paymentMethod && selectedOrder.paymentMethod !== 'cod' && 
                 selectedOrder.paymentStatus === 'pending' && (
                  <div className="payment-actions">
                    <button 
                      onClick={() => verifyPayment(selectedOrder._id, 'verified')}
                      disabled={selectedOrder.paymentUpdating}
                    >
                      {selectedOrder.paymentUpdating ? 'Verifying...' : 'Verify Payment'}
                    </button>
                    <button 
                      onClick={() => verifyPayment(selectedOrder._id, 'failed')}
                      disabled={selectedOrder.paymentUpdating}
                    >
                      Mark as Failed
                    </button>
                  </div>
                )}
              </div>

              <div className="order-info">
                <h3>Order</h3>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> 
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                    className={`status-${selectedOrder.status}`}
                    disabled={selectedOrder.updating}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </p>
                <p><strong>Subtotal:</strong> ${selectedOrder.subtotal?.toFixed(2)}</p>
                <p><strong>Shipping:</strong> ${selectedOrder.shipping?.toFixed(2)}</p>
                <p><strong>Total:</strong> ${selectedOrder.total?.toFixed(2)}</p>
              </div>
            </div>

            <div className="items-list">
              <h3>Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="product-thumbnail"
                          />
                        )}
                      </td>
                      <td>{item.size || '-'}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="status-history">
                <h3>Status History</h3>
                <ul>
                  {selectedOrder.statusHistory.map((history, index) => (
                    <li key={index}>
                      <strong>{history.status}</strong> - 
                      {new Date(history.changedAt).toLocaleString()}
                      {history.notes && ` - ${history.notes}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;