// recipecart-frontend/src/pages/OrderHistory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/OrderHistory.css';
import { usePopup } from '../components/CustomPopup';
import { formatIngredientPrice, formatQuantityWithUnit } from '../utils/priceUtils';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();

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
      showPopup("You must be logged in to view orders.", "error");
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
      showPopup("Order canceled.", "success");
      fetchOrders();
    } catch (err) {
      showPopup("Failed: " + (err.response?.data?.message || "Unknown error"), "error");
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
                          <div className="header-price">Quantity</div>
                          <div className="header-quantity">Unit Price</div>
                          <div className="header-total">Total</div>
                        </div>

                        {items.map(item => {
                          const priceInfo = formatIngredientPrice(item.ingredient);
                          const quantityDisplay = formatQuantityWithUnit(item.quantity, item.ingredient.unit);
                          const unitPrice = item.priceAtPurchase / item.quantity;

                          return (
                            <div key={item.id} className="cart-item">
                              <div className="item-info">
                                <div className="item-image">🥚</div>
                                <div className="item-details">
                                  <p className="item-name">{item.ingredient.name}</p>
                                  <p className="item-unit">{priceInfo.formattedPrice}</p>
                                </div>
                              </div>

                              <div className="item-price">{quantityDisplay}</div>

                              <div className="item-quantity">
                                <span className="quantity-value">₱{unitPrice.toFixed(2)}</span>
                              </div>

                              <div className="item-total">₱{item.priceAtPurchase.toFixed(2)}</div>
                            </div>
                          );
                        })}
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