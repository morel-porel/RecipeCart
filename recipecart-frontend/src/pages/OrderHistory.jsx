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

  const API_BASE_URL = 'http://localhost:8080/api';

  const groupItemsByRecipe = (items) => {
    if (!items) return {};
    const grouped = {};
    items.forEach(item => {
      const recipeSource = item.recipeSource || 'Individual Items';
      if (!grouped[recipeSource]) grouped[recipeSource] = [];
      grouped[recipeSource].push(item);
    });
    return grouped;
  };

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
      <div className="orders-page-wrapper">
        <MainNavbar />
        <div className="loading-container">
          <p>Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page-wrapper">
      <MainNavbar />

      <div className="orders-page">
        <div className="page-title-with-back">
          <button
            className="back-button"
            onClick={() => navigate("/profile")}
          >
            ←
          </button>
          <h1 className="page-title">Order History</h1>
        </div>


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
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p>{formatDate(order.orderDate)}</p>
                  </div>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-body">
                  {Object.entries(groupItemsByRecipe(order.orderItems)).map(([recipeName, items]) => (
                    <div key={recipeName} className="recipe-group">
                      <div className="recipe-group-header">
                        <h3>{recipeName === 'Individual Items' ? '🛒 Individual Items' : `🍳 ${recipeName}`}</h3>
                        <span className="item-count">{items.length} item{items.length > 1 ? 's' : ''}</span>
                      </div>

                      <div className="cart-container">
                        <div className="cart-header">
                          <div className="header-item">Item</div>
                          <div className="header-price">Price</div>
                          <div className="header-quantity">Quantity</div>
                          <div className="header-total">Total</div>
                        </div>

                        {items.map(item => (
                          <div key={item.id} className="cart-item">
                            <div className="item-info">
                              <div className="item-image">🥚</div>
                              <div className="item-details">
                                <p className="item-name">{item.ingredient.name}</p>
                                <p className="item-unit">{item.ingredient.unit}</p>
                              </div>
                            </div>

                            <div className="item-price">₱{(item.priceAtPurchase / item.quantity).toFixed(2)}</div>

                            <div className="item-quantity">
                              <span className="quantity-value">{item.quantity}</span>
                            </div>

                            <div className="item-total">₱{item.priceAtPurchase.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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