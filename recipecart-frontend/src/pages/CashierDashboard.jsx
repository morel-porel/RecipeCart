// src/pages/CashierDashboard.jsx
import { useState, useEffect } from 'react';
import { getUserId } from '../utils/authUtils';
import axios from 'axios';

function CashierDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cashier/dashboard');
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cashier-dashboard">
      <h1>Cashier Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Processing Orders</h3>
          <p>{dashboardStats?.processingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Ready for Pickup</h3>
          <p>{dashboardStats?.readyForPickup}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Orders</h3>
          <p>{dashboardStats?.completedOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₱{dashboardStats?.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}

export default CashierDashboard;