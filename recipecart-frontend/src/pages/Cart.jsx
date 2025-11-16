import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Cart.css';
import MainNavbar from '../components/MainNavbar';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const userId = 1;
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
      alert('Failed to update quantity: ' + err.response?.data?.message);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/cart/${userId}/items/${cartItemId}`
      );
      setCart(response.data);
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.ingredient.price * item.quantity);
    }, 0);
  };

  const handleProceedToPayment = () => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="page-container">
        <MainNavbar />
        <div className="loading-container">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <MainNavbar />
      
      <div className="cart-page">
        <h1 className="page-title">Shopping Cart</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
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
            {/* Cart Header */}
            <div className="cart-container">
              <div className="cart-header">
                <div className="header-item">Shopping Cart</div>
                <div className="header-price">Price</div>
                <div className="header-quantity">Quantity</div>
                <div className="header-total">Total</div>
              </div>

              {/* Cart Items */}
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <div className="item-image">
                      <span>🥚</span>
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.ingredient.name}</p>
                      <p className="item-unit">{item.ingredient.unit}</p>
                    </div>
                  </div>

                  <div className="item-price">
                    ₱{item.ingredient.price.toFixed(2)}
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
                    ₱{(item.ingredient.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
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