// src/utils/authUtils.js

/**
 * Authentication utility functions for managing user state
 */

// Get current logged-in user from localStorage
export const getCurrentUser = () => {
  try {
    const userJSON = localStorage.getItem('user');
    return userJSON ? JSON.parse(userJSON) : null;
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
};

// Get current user's role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Get current user's ID
export const getUserId = () => {
  const user = getCurrentUser();
  return user?.id;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('user');
};

// Check if user has a specific role
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole?.toUpperCase() === requiredRole?.toUpperCase();
};

// Check if user is a cashier
export const isCashier = () => {
  return hasRole('CASHIER');
};

// Check if user is an admin
export const isAdmin = () => {
  return hasRole('ADMIN');
};

// Check if user is a regular customer
export const isCustomer = () => {
  return hasRole('USER') || hasRole('CUSTOMER');
};

// Save user after login
export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userRole', user.role);
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
};

// Get authorization header for API calls
export const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.id) {
    return {
      'X-User-ID': user.id,
      'X-User-Role': getUserRole()
    };
  }
  return {};
};

export default {
  getCurrentUser,
  getUserRole,
  getUserId,
  isLoggedIn,
  hasRole,
  isCashier,
  isAdmin,
  isCustomer,
  setCurrentUser,
  logout,
  getAuthHeader
};