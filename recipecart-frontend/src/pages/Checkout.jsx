import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/Checkout.css';
import { usePopup } from '../components/CustomPopup';
import { formatIngredientPrice, calculateItemTotal, formatQuantityWithUnit } from '../utils/priceUtils';

const Checkout = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id || null;

  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
  });

  const { showPopup } = usePopup();

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    if (!userId) {
      showPopup('You must be logged in to checkout', 'error');
      navigate('/login');
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}/summary`);
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      showPopup('Failed to load cart', 'error');
      navigate('/cart');
    }
  };

  const handleInputChange = (e) => {
    setReservationDetails({
      ...reservationDetails,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!paymentMethod) {
      showPopup('Please select a payment method', 'error');
      return false;
    }

    if (paymentMethod === 'PAY_IN_STORE') {
      if (!reservationDetails.fullName || !reservationDetails.contactNumber) {
        showPopup('Please fill in all required reservation details', 'error');
        return false;
      }
    }

    if (paymentMethod === 'PAID_ONLINE') {
      if (!paymentOption) {
        showPopup('Please select a payment option', 'error');
        return false;
      }
    }

    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) return;

    setProcessing(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/orders/checkout`, {
        userId: userId,
        paymentType: paymentMethod
      });

      showPopup('Order placed successfully! Order ID: ' + response.data.id, 'success');
      navigate('/home');
    } catch (err) {
      showPopup('Failed to place order: ' + (err.response?.data?.message || 'Unknown error'), 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page-wrapper">
        <MainNavbar />
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <MainNavbar />

      <div className="checkout-page">
        <h1 className="page-title">
          Payment Details {paymentMethod === 'PAY_IN_STORE' ? '(Reserved)' : '(Online)'}
        </h1>

        <div className="payment-method-section">
          <h2 className="section-title">Choose your payment method:</h2>

          <div className="radio-options">
            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="PAY_IN_STORE"
                checked={paymentMethod === 'PAY_IN_STORE'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>On-site (Make reservation)</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="PAID_ONLINE"
                checked={paymentMethod === 'PAID_ONLINE'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Pay Online</span>
            </label>
          </div>
        </div>

        {paymentMethod === 'PAY_IN_STORE' && (
          <div className="details-section">
            <h3 className="subsection-title">Reservation Details</h3>

            <div className="form-group">
              <label>
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={reservationDetails.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Contact Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={reservationDetails.contactNumber}
                onChange={handleInputChange}
                placeholder="Enter your contact number"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address (optional)</label>
              <input
                type="email"
                name="email"
                value={reservationDetails.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="pickup-info">
              <h4>Pickup Location</h4>
              <p>RecipeCart Main, Somewhere Street</p>

              <h4>Pickup Date and Time:</h4>
              <p>12/11/25 &nbsp;&nbsp; 9:00 AM - 10:00 PM</p>
            </div>
          </div>
        )}

        {paymentMethod === 'PAID_ONLINE' && (
          <div className="details-section">
            <h3 className="subsection-title">Select Payment Option</h3>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentOption"
                  value="CREDIT_CARD"
                  checked={paymentOption === 'CREDIT_CARD'}
                  onChange={(e) => setPaymentOption(e.target.value)}
                />
                <span>Credit Card 💳</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentOption"
                  value="PAYPAL"
                  checked={paymentOption === 'PAYPAL'}
                  onChange={(e) => setPaymentOption(e.target.value)}
                />
                <span>Paypal 🅿️</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentOption"
                  value="GCASH"
                  checked={paymentOption === 'GCASH'}
                  onChange={(e) => setPaymentOption(e.target.value)}
                />
                <span>GCash 📱</span>
              </label>
            </div>
          </div>
        )}

        {cart && (
          <div className="order-summary">
            <h3 className="subsection-title">Order Summary</h3>

            <div className="summary-items">
              {cart.cart.items.map((item) => {
                const priceInfo = formatIngredientPrice(item.ingredient);
                const itemTotal = calculateItemTotal(item.ingredient, item.quantity);
                const quantityDisplay = formatQuantityWithUnit(item.quantity, item.ingredient.unit);

                return (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-details">
                      <span className="summary-item-name">{item.ingredient.name}</span>
                      <span className="summary-item-quantity">
                        {quantityDisplay}
                      </span>
                    </div>
                    <span className="summary-item-total">₱{itemTotal.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="summary-total">
              <span>Total:</span>
              <span className="total-amount">₱{cart.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button
            onClick={handleConfirmOrder}
            disabled={processing}
            className="confirm-button"
          >
            {processing ? 'Processing...' : 'Confirm Order'}
          </button>

          <button
            onClick={() => navigate('/cart')}
            style={{ 
               width: '100%',
               backgroundColor: '#e5e7eb',
               color: '#374151',
               padding: '0.75rem',
               borderRadius: '0.5rem',
               border: 'none',
               fontSize: '1.125rem',
               fontWeight: 600,
               cursor: 'pointer',
               transition: 'background-color 0.2s'
            }}
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;