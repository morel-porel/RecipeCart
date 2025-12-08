// recipecart-frontend/src/pages/OrderDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/OrderDetails.css';
import { formatIngredientPrice, formatQuantityWithUnit } from '../utils/priceUtils';

const API_BASE_URL = 'http://localhost:8080/api/cashier';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setErrorMessage('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setSuccessMessage(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setErrorMessage('Failed to update order status');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleProcessPayment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Payment processing failed');
      
      setSuccessMessage('Payment processed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage('Failed to process payment');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PROCESSING': return 'od-status-processing';
      case 'READY_FOR_PICKUP': return 'od-status-ready';
      case 'COMPLETED': return 'od-status-completed';
      case 'CANCELED': return 'od-status-canceled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <>
        <MainNavbar />
        <div className="od-wrapper">
          <div className="od-loading">Loading order details...</div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <MainNavbar />
        <div className="od-wrapper">
          <div className="od-error">Order not found</div>
          <button className="od-back-btn" onClick={() => navigate('/cashier')}>
            ← Back to Orders
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="od-wrapper">
        {successMessage && (
          <div className="od-success-message">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="od-error-message">{errorMessage}</div>
        )}

        <button className="od-back-btn" onClick={() => navigate('/cashier')}>
          ← Back to Orders
        </button>

        <h1 className="od-title">Order #{order.id}</h1>

        <div className="od-row">
          <div className="od-items">
            {order.orderItems.slice(0, 4).map((item, idx) => (
              <div key={idx} className="od-item">
                <img 
                  src={`https://via.placeholder.com/92x92/96d313/ffffff?text=${item.ingredient.name.charAt(0)}`}
                  alt={item.ingredient.name}
                  className="od-item-img"
                />
                <div className="od-item-label">
                  {item.ingredient.name} x{item.quantity}
                </div>
              </div>
            ))}
            {order.orderItems.length > 4 && (
              <div className="od-item">
                <div className="od-item-more">
                  +{order.orderItems.length - 4} more
                </div>
              </div>
            )}
          </div>

          <div className="od-meta">
            <div className="od-customer">
              Customer: {order.user?.username || 'N/A'}
            </div>
            <div className="od-time">{formatTime(order.orderDate)}</div>
            <div className="od-date">{formatDate(order.orderDate)}</div>
          </div>
        </div>

        <div className="od-status-row">
          <span className="od-status-label">Status:</span>
          <span className={`od-status-value ${getStatusClass(order.status)}`}>
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="od-section">
          <h2 className="od-section-title">Payment Information</h2>
          <div className="od-info-grid">
            <div className="od-info-item">
              <span className="od-info-label">Payment Type:</span>
              <span className="od-info-value">
                {order.paymentType === 'PAID_ONLINE' ? 'Paid Online' : 'Pay in Store'}
              </span>
            </div>
            <div className="od-info-item">
              <span className="od-info-label">Total Amount:</span>
              <span className="od-info-value od-total">₱{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="od-section">
          <h2 className="od-section-title">Order Items</h2>
          <table className="od-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
                {order.orderItems.some(item => item.recipeSource) && (
                  <th>Recipe Source</th>
                )}
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => {
                const priceInfo = formatIngredientPrice(item.ingredient);
                const quantityDisplay = formatQuantityWithUnit(item.quantity, item.ingredient.unit);
                const unitPrice = item.priceAtPurchase / item.quantity;

                return (
                  <tr key={index}>
                    <td>
                      <div>{item.ingredient.name}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {priceInfo.formattedPrice}
                      </div>
                    </td>
                    <td>{quantityDisplay}</td>
                    <td>₱{unitPrice.toFixed(2)}</td>
                    <td>₱{item.priceAtPurchase.toFixed(2)}</td>
                    {order.orderItems.some(item => item.recipeSource) && (
                      <td>{item.recipeSource || '-'}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="od-total-row">
                <td colSpan={order.orderItems.some(item => item.recipeSource) ? 3 : 2}>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>₱{order.totalAmount.toFixed(2)}</strong>
                </td>
                {order.orderItems.some(item => item.recipeSource) && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="od-actions-section">
          <h2 className="od-section-title">Actions</h2>
          <div className="od-button-group">
            {order.status === 'PROCESSING' && (
              <>
                <button 
                  className="od-btn od-btn-primary"
                  onClick={() => updateOrderStatus('READY_FOR_PICKUP')}
                >
                  Mark as Ready for Pickup
                </button>
                <button 
                  className="od-btn od-btn-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this order?')) {
                      updateOrderStatus('CANCELED');
                    }
                  }}
                >
                  Cancel Order
                </button>
              </>
            )}
            {order.status === 'READY_FOR_PICKUP' && (
              <>
                <button 
                  className="od-btn od-btn-success"
                  onClick={() => updateOrderStatus('COMPLETED')}
                >
                  Mark as Completed
                </button>
                {order.paymentType === 'PAY_IN_STORE' && (
                  <button 
                    className="od-btn od-btn-warning"
                    onClick={handleProcessPayment}
                  >
                    Process Payment
                  </button>
                )}
              </>
            )}
            {(order.status === 'COMPLETED' || order.status === 'CANCELED') && (
              <p className="od-completed-note">
                This order has been {order.status.toLowerCase().replace(/_/g, ' ')}.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}