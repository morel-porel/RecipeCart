// src/pages/UnauthorizedPage.jsx

import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../utils/authUtils';
import '../assets/styles/UnauthorizedPage.css'; // We'll create this CSS file

function UnauthorizedPage() {
  const navigate = useNavigate();
  const userRole = getUserRole();

  const handleGoBack = () => {
    // Route based on role to appropriate dashboard
    if (userRole?.toUpperCase() === 'CASHIER') {
      navigate('/cashier/dashboard');
    } else if (userRole?.toUpperCase() === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/home');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <h1 className="error-code">403</h1>
          <h2 className="error-title">Access Denied</h2>
          
          <p className="error-message">
            You don't have permission to access this page.
          </p>
          
          {userRole && (
            <p className="user-role-info">
              Your current role is: <strong>{userRole}</strong>
            </p>
          )}

          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={handleGoBack}
            >
              Go to Dashboard
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;