import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component to guard routes based on user role
 * Usage: <ProtectedRoute requiredRole="CASHIER" component={CashierDashboard} />
 */
function ProtectedRoute({ requiredRole, component: Component }) {
  // Get user from localStorage
  const userJSON = localStorage.getItem('user');
  const userRole = localStorage.getItem('userRole');

  // Check if user is logged in
  if (!userJSON) {
    return <Navigate to="/login" replace />;
  }

  // Parse user object
  let user = null;
  try {
    user = JSON.parse(userJSON);
  } catch (e) {
    console.error('Error parsing user data:', e);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // If no specific role is required, user just needs to be logged in
  if (!requiredRole) {
    return <Component />;
  }

  // Check if user has the required role
  const hasRequiredRole = userRole?.toUpperCase() === requiredRole?.toUpperCase();

  if (!hasRequiredRole) {
    console.warn(`Access denied: User role is ${userRole}, but ${requiredRole} is required`);
    return <Navigate to="/unauthorized" replace />;
  }

  // User has the required role, render the component
  return <Component />;
}

export default ProtectedRoute;