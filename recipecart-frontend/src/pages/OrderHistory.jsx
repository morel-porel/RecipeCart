import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../assets/styles/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const navigate = useNavigate();
  const userId = 1;
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PROCESSING':
        return 'status-processing';
      case 'READY_FOR_PICKUP':
        return 'status-ready';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELED':
        return 'status-canceled';
      default:
        return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        userId: userId
      });
      alert('Order canceled successfully');
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="loading-container">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="orders-page">
        <h1 className="page-title">Order History</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>No orders yet</p>
            <button
              onClick={() => navigate('/ingredients')}
              className="primary-button"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-status-badge">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    {order.orderItems.slice(0, selectedOrder === order.id ? undefined : 3).map((item) => (
                      <div key={item.id} className="order-item">
                        <span className="item-description">
                          {item.ingredient.name} x {item.quantity}
                        </span>
                        <span className="item-price">
                          ₱{item.priceAtPurchase.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    
                    {order.orderItems.length > 3 && selectedOrder !== order.id && (
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="show-more-btn"
                      >
                        + {order.orderItems.length - 3} more items
                      </button>
                    )}
                    
                    {selectedOrder === order.id && order.orderItems.length > 3 && (
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="show-more-btn"
                      >
                        Show less
                      </button>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total-info">
                      <span className="total-label">Total: ₱{order.totalAmount.toFixed(2)}</span>
                      <span className="payment-info">
                        Payment: {order.paymentType === 'PAID_ONLINE' ? '💳 Online' : '🏪 In-Store'}
                      </span>
                    </div>
                    
                    {order.status === 'PROCESSING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="cancel-order-btn"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;