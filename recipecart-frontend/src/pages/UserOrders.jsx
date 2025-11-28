import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/UserOrders.css'; // your custom CSS

const mockOrders = [
  { id: 1, date: '2025-11-28', totalAmount: 250, status: 'Completed', paymentType: 'Cash' },
  { id: 2, date: '2025-11-27', totalAmount: 500, status: 'Pending', paymentType: 'Card' },
  { id: 3, date: '2025-11-26', totalAmount: 120, status: 'Completed', paymentType: 'Cash' },
];

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const handleViewDetails = (order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleCancel = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      alert('Order cancelled');
    }
  };

  const handleSearch = (term) => {
    alert(`Search for: ${term}`); // placeholder search functionality
  };

  return (
    <div className="page-container">
      {/* Navbar fixed on top */}
      <MainNavbar onSearch={handleSearch} />

      {/* Page content */}
      <div className="user-orders-page">
        <h1 className="user-orders-title">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">No orders found</div>
        ) : (
          <div className="orders-container">
            <div className="orders-header">
              <div>Order ID</div>
              <div>Date</div>
              <div>Total</div>
              <div>Status</div>
              <div>Payment</div>
              <div>Actions</div>
            </div>

            {orders.map(order => (
              <div key={order.id} className="order-item">
                <div>{order.id}</div>
                <div>{order.date}</div>
                <div>₱{order.totalAmount}</div>
                <div className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
                <div>{order.paymentType}</div>
                <div className="order-actions">
                  <button
                    className="primary-button"
                    onClick={() => handleViewDetails(order)}
                  >
                    View
                  </button>
                  <button
                    className="primary-button cancel"
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
