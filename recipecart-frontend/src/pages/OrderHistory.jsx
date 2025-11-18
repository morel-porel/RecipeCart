import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    if (!userId) {
      alert("You must be logged in to view orders.");
      return navigate("/login");
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/orders`);
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`, { userId });
      alert("Order canceled.");
      fetchOrders();
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US");
  };

  if (loading) {
    return (
      <div className="page-container">
        <MainNavbar />
        <p>Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <MainNavbar />

      <div className="orders-page">
        <h1 className="page-title">Order History</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>No orders found</p>
            <button onClick={() => navigate("/home")} className="primary-button">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <p>{formatDate(order.orderDate)}</p>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-body">
                  {(expandedOrder === order.id
                    ? order.orderItems
                    : order.orderItems.slice(0, 3)
                  ).map(item => (
                    <div key={item.id} className="order-item">
                      <span>{item.ingredient.name} × {item.quantity}</span>
                      <span>₱{item.priceAtPurchase.toFixed(2)}</span>
                    </div>
                  ))}

                  {order.orderItems.length > 3 && (
                    <button
                      className="show-more-btn"
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order.id ? null : order.id)
                      }
                    >
                      {expandedOrder === order.id
                        ? "Show less"
                        : `+ ${order.orderItems.length - 3} more`}
                    </button>
                  )}
                </div>

                <div className="order-footer">
                  <strong>Total: ₱{order.totalAmount.toFixed(2)}</strong>

                  {order.status === "PROCESSING" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
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
