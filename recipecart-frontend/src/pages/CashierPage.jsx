import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/CashierPage.css';

const API_BASE_URL = 'http://localhost:8080/api/cashier';

export default function CashierPage() {
  const [orders, setOrders] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // all, processing, ready, completed
  const navigate = useNavigate();

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/orders/all`;
      
      if (statusFilter !== 'all') {
        const statusMap = {
          processing: 'PROCESSING',
          ready: 'READY_FOR_PICKUP',
          completed: 'COMPLETED'
        };
        url = `${API_BASE_URL}/orders?status=${statusMap[statusFilter]}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      const updatedOrder = await response.json();
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(o => o.id === orderId ? updatedOrder : o)
      );
      
      showSuccess(`Order status updated to ${newStatus}`);
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      showError('Failed to update order status');
    }
  };

  const handleMarkAsReady = (orderId) => {
    updateOrderStatus(orderId, 'READY_FOR_PICKUP');
  };

  const handleMarkAsCompleted = (orderId) => {
    updateOrderStatus(orderId, 'COMPLETED');
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );
    
    if (confirmed) {
      try {
        await updateOrderStatus(orderId, 'CANCELED');
        // Remove from list after canceling
        setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
        showSuccess('Order canceled successfully');
      } catch (error) {
        console.error('Error canceling order:', error);
        showError('Failed to cancel order');
      }
    }
  };

  const handleProcessPayment = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Payment processing failed');
      
      showSuccess('Payment processed successfully');
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error processing payment:', error);
      showError('Failed to process payment');
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
        return '';
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
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

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const filteredOrders = orders.filter((order) =>
    order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  return (
    <>
      <MainNavbar />
      <div className="page-container">
        <div className="content-wrapper">
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}

          {/* Title + Actions + Search */}
          <div className="new-orders-title-wrapper">
            <div className="title-section">
              <span className="new-orders-title">Orders Management</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="add-recipe-nav-btn"
                  style={{ backgroundColor: '#FF9800' }}
                  onClick={() => navigate('/cashier/recipes')}
                >
                  Manage Recipes
                </button>
                <button 
                  className="add-recipe-nav-btn"
                  style={{ backgroundColor: '#FF9800' }}
                  onClick={() => navigate('/stock')}
                >
                  Manage Stock
                </button>
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="status-filter">
              <button 
                className={statusFilter === 'all' ? 'active' : ''}
                onClick={() => setStatusFilter('all')}
              >
                All Orders
              </button>
              <button 
                className={statusFilter === 'processing' ? 'active' : ''}
                onClick={() => setStatusFilter('processing')}
              >
                Processing
              </button>
              <button 
                className={statusFilter === 'ready' ? 'active' : ''}
                onClick={() => setStatusFilter('ready')}
              >
                Ready
              </button>
              <button 
                className={statusFilter === 'completed' ? 'active' : ''}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
            </div>

            <form
              className="cashier-search-bar"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Search by order ID or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>
          </div>

          {/* Orders Table */}
          <div className="cart-container">
            {loading ? (
              <div className="loading-spinner">Loading orders...</div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date & Time</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      {/* Order ID */}
                      <td className="centered-cell">#{order.id}</td>

                      {/* Customer */}
                      <td className="centered-cell">
                        {order.user?.username || 'Unknown'}
                      </td>

                      {/* Time & Date */}
                      <td className="centered-cell">
                        <div>{formatTime(order.orderDate)}</div>
                        <div className="text-muted">{formatDate(order.orderDate)}</div>
                      </td>

                      {/* Items */}
                      <td className="centered-cell">
                        <div className="order-items-preview">
                          {order.orderItems?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="item-preview">
                              {item.ingredient.name} x{item.quantity}
                            </div>
                          ))}
                          {order.orderItems?.length > 3 && (
                            <div className="text-muted">
                              +{order.orderItems.length - 3} more
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="centered-cell">
                        ₱{order.totalAmount?.toFixed(2)}
                      </td>

                      {/* Payment Type */}
                      <td className="centered-cell">
                        <span className={`payment-badge ${order.paymentType === 'PAID_ONLINE' ? 'paid-online' : 'pay-in-store'}`}>
                          {order.paymentType === 'PAID_ONLINE' ? 'Paid Online' : 'Pay in Store'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="centered-cell">
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="centered-cell">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === order.id ? null : order.id);
                            }}
                          >
                            ⋮
                          </button>

                          {activeDropdown === order.id && (
                            <div className="dropdown-menu">
                              {order.status === 'PROCESSING' && (
                                <>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleMarkAsReady(order.id)}
                                  >
                                    Mark as Ready
                                  </button>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleCancelOrder(order.id)}
                                  >
                                    Cancel Order
                                  </button>
                                </>
                              )}
                              {order.status === 'READY_FOR_PICKUP' && (
                                <>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleMarkAsCompleted(order.id)}
                                  >
                                    Mark as Completed
                                  </button>
                                  {order.paymentType === 'PAY_IN_STORE' && (
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleProcessPayment(order.id)}
                                    >
                                      Process Payment
                                    </button>
                                  )}
                                </>
                              )}
                              <button 
                                className="dropdown-item"
                                onClick={() => navigate(`/order-details/${order.id}`)}
                              >
                                View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && filteredOrders.length === 0 && (
              <div className="empty-cart">
                <p>No orders found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}