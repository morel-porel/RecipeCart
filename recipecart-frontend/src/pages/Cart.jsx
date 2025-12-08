// recipecart-frontend/src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Cart.css';
import MainNavbar from '../components/MainNavbar';
import { usePopup } from '../components/CustomPopup';
import { formatIngredientPrice, calculateItemTotal, formatQuantityWithUnit } from '../utils/priceUtils';

const Cart = () => {
  const { showPopup } = usePopup();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedView, setGroupedView] = useState(true);
  const navigate = useNavigate();

  const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const user = getUser();
  const userId = user?.id || 1;
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
      setCart(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/cart/${userId}/items/${cartItemId}`,
        { quantity: newQuantity }
      );
      setCart(response.data);
    } catch (err) {
      showPopup('Failed to update quantity: ' + err.response?.data?.message, 'error');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/cart/${userId}/items/${cartItemId}`
      );
      setCart(response.data);
    } catch (err) {
      showPopup('Failed to remove item', 'error');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + calculateItemTotal(item.ingredient, item.quantity);
    }, 0);
  };

  const handleProceedToPayment = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      showPopup('Your cart is empty', 'error');
      return;
    }
    navigate('/checkout');
  };

  const groupItemsByRecipe = () => {
    if (!cart || !cart.items) return {};

    const grouped = {};
    
    cart.items.forEach(item => {
      const recipeSource = item.recipeSource || 'Individual Items';
      
      if (!grouped[recipeSource]) {
        grouped[recipeSource] = [];
      }
      grouped[recipeSource].push(item);
    });

    return grouped;
  };

  const groupedItems = groupItemsByRecipe();

  const renderCartItem = (item) => {
    const priceInfo = formatIngredientPrice(item.ingredient);
    const itemTotal = calculateItemTotal(item.ingredient, item.quantity);
    const quantityDisplay = formatQuantityWithUnit(item.quantity, item.ingredient.unit);

    return (
      <div key={item.id} className="cart-item">
        <div className="item-info">
          <div className="item-image">
            <span>🥚</span>
          </div>
          <div className="item-details">
            <p className="item-name">{item.ingredient.name}</p>
            <p className="item-unit">{priceInfo.formattedPrice}</p>
            {item.recipeSource && !groupedView && (
              <p className="item-recipe-tag">From: {item.recipeSource}</p>
            )}
          </div>
        </div>

        <div className="item-price">
          {quantityDisplay}
        </div>

        <div className="item-quantity">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="quantity-btn"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="quantity-value">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="quantity-btn"
          >
            +
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="remove-btn"
            title="Remove item"
          >
            🗑️
          </button>
        </div>

        <div className="item-total">
          ₱{itemTotal.toFixed(2)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="cart-page-wrapper">
        <MainNavbar />
        <div className="loading-container">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <MainNavbar />

      <div className="cart-page">
        <div className="cart-header-section">
          <h1 className="page-title">Shopping Cart</h1>
          <button 
            className="view-toggle-btn" 
            onClick={() => setGroupedView(!groupedView)}
          >
            {groupedView ? '📋 Flat View' : '📦 Grouped View'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button
              onClick={() => navigate('/home')}
              className="primary-button"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {groupedView ? (
              <div className="cart-grouped-container">
                {Object.entries(groupedItems).map(([recipeName, items]) => (
                  <div key={recipeName} className="recipe-group">
                    <div className="recipe-group-header">
                      <h3>
                        {recipeName === 'Individual Items' ? '🛒 Individual Items' : `🍳 ${recipeName}`}
                      </h3>
                      <span className="item-count">{items.length} item{items.length > 1 ? 's' : ''}</span>
                    </div>

                    <div className="cart-container">
                      <div className="cart-header">
                        <div className="header-item">Item</div>
                        <div className="header-price">Quantity</div>
                        <div className="header-quantity">Actions</div>
                        <div className="header-total">Total</div>
                      </div>

                      {items.map(renderCartItem)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cart-container">
                <div className="cart-header">
                  <div className="header-item">Shopping Cart</div>
                  <div className="header-price">Quantity</div>
                  <div className="header-quantity">Actions</div>
                  <div className="header-total">Total</div>
                </div>

                {cart.items?.map(renderCartItem)}
              </div>
            )}

            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">Total:</span>
                <span className="summary-amount">
                  ₱{calculateTotal().toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="checkout-button"
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;