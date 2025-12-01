import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PreferencesPage from './pages/PreferencesPage.jsx';

import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderHistory from './pages/OrderHistory.jsx';

import './index.css';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import { UserProvider } from './context/UserContext.jsx';

import CashierPage from './pages/CashierPage.jsx';
import AddRecipePage from './pages/AddRecipePage.jsx';

// Define the application's routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      {
        path: '/', // Show LoginPage by default
        element: <LoginPage />,
      },
      {
        path: 'login', 
        element: <LoginPage />,
      },
      {
        path: 'register', 
        element: <RegisterPage />,
      },
      {
        path: 'preferences',
        element: <PreferencesPage />,
      },
      // ✅ ADD YOUR NEW ROUTES HERE
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'orders',
        element: <OrderHistory />,
      },

      { path: 'home', element: <HomePage />},
      { path: 'recipes/:id', element: <RecipeDetailPage /> },

      { path: 'cashier', element: <CashierPage /> },

      {
        path: 'user-orders',   // URL: /user-orders
        element: <UserOrders />,
      },
      {
        path: 'add-recipe',
        element: <AddRecipePage />,
      },

    ],
  },
]);

// Render the RouterProvider with the defined router
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);