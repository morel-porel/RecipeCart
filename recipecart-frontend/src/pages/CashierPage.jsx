import { useState, useEffect } from 'react';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/CashierPage.css';
import EggImg from '../assets/images/egg.png';
import SpinachImg from '../assets/images/spinach.png';
import BreadImg from '../assets/images/bread.png';

const defaultOrders = [
  {
    id: 1,
    buyer: { name: 'John Doe' },
    time: '10:30 AM',
    date: '2025-11-28',
    status: 'processing',
    products: [
      { name: 'Egg', quantity: 2, picture: EggImg },
      { name: 'Spinach', quantity: 2, picture: SpinachImg },
    ],
  },
  {
    id: 2,
    buyer: { name: 'Jane Smith' },
    time: '11:00 AM',
    date: '2025-11-28',
    status: 'ready',
    products: [
      { name: 'Bread', quantity: 1, picture: BreadImg },
    ],
  },
];

export default function CashierPage() {
  const [orders, setOrders] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setOrders(defaultOrders);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'processing':
        return 'status-processing';
      case 'ready':
        return 'status-ready';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const handleCancelOrder = (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel the order from ${name}?`
    );
    if (confirmed) {
      setOrders((prevOrders) => prevOrders.filter((o) => o.id !== id));
      setActiveDropdown(null);
      setSuccessMessage(`Order from ${name} has been canceled successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <MainNavbar />
      <div className="page-container">
        <div className="content-wrapper">
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {/* Title + Search */}
          <div className="new-orders-title-wrapper">
            <span className="new-orders-title">New Orders</span>
            <form
              className="cashier-search-bar"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>
          </div>

          {/* Orders Table */}
          <div className="cart-container">
            <table className="orders-table">
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    {/* Product Images */}
                    <td className="centered-cell">
                      <div className="product-images-wrapper">
                        {order.products.map((p, idx) => (
                          <img
                            key={idx}
                            src={p.picture}
                            alt={p.name}
                            className="item-image"
                          />
                        ))}
                      </div>
                    </td>

                    {/* Buyer Name */}
                    <td className="centered-cell">{order.buyer.name}</td>

                    {/* Time & Date */}
                    <td className="centered-cell">
                      <div>{order.time}</div>
                      <div>{order.date}</div>
                    </td>

                    {/* Product Quantity */}
                    <td className="centered-cell">
                      {order.products.map((p, idx) => (
                        <div key={idx}>
                          {p.name} x{p.quantity}
                        </div>
                      ))}
                    </td>

                    {/* Status */}
                    <td className="centered-cell">
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="centered-cell">
                      <div style={{ position: 'relative', display: 'inline-block', zIndex: 1000 }}>
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
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleCancelOrder(order.id, order.buyer.name)
                              }
                            >
                              Cancel Order
                            </button>
                            <button className="dropdown-item">View Details</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="empty-cart">
                <p>No new orders.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
