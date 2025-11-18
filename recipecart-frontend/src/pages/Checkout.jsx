import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();

  // NEW: get logged-in user from localStorage
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

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    // Redirect if not logged in
    if (!userId) {
      alert("You must be logged in to checkout");
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
      alert("Failed to load cart");
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
      alert('Please select a payment method');
      return false;
    }

    if (paymentMethod === 'PAY_IN_STORE') {
      if (!reservationDetails.fullName || !reservationDetails.contactNumber) {
        alert('Please fill in all reservation details');
        return false;
      }
    }

    if (paymentMethod === 'PAID_ONLINE') {
      if (!paymentOption) {
        alert('Please select a payment option');
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

      alert('Order placed successfully! Order ID: ' + response.data.id);
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <MainNavbar />
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <MainNavbar />

      {/* Everything below stays the same — unchanged */}
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

        {/* Reservation Details */}
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
              <p>Something something location, Elsewhere Street</p>

              <h4>Pickup Date and Time:</h4>
              <p>07/11/24 &nbsp;&nbsp; 9:00 AM - 10:00 PM</p>
            </div>
          </div>
        )}

        {/* Payment Options */}
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

        {/* Order Summary */}
        {cart && (
          <div className="order-summary">
            <h3 className="subsection-title">Order Summary</h3>

            <div className="summary-items">
              {cart.cart.items.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.ingredient.name} x {item.quantity}</span>
                  <span>₱{(item.ingredient.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
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
            {processing ? 'Processing...' : 'Confirm'}
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="back-button"
          >
            Back to Cart
          </button>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
