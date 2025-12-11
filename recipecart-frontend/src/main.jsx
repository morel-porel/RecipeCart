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

import OrderDetails from './pages/OrderDetails.jsx';
import AddRecipePage from './pages/AddRecipePage.jsx';
import EditRecipePage from './pages/EditRecipePage';
import ProfilePage from './pages/ProfilePage.jsx';
import RecipeListPage from './pages/RecipeListPage';

import CashierPage from './pages/CashierPage.jsx';
import StockPage from './pages/StockPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';

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
      { 
        path: 'home', 
        element: <HomePage />
      },
      { 
        path: 'recipes/:id', 
        element: <RecipeDetailPage /> 
      },
      {
        path: 'cashier', 
        element: <ProtectedRoute requiredRole="CASHIER" component={CashierPage} />,
      },
      {
        path: 'stock',
        element: <ProtectedRoute requiredRole="CASHIER" component={StockPage} />,
      },
      {
        path: 'order-details/:orderId',
        element: <OrderDetails />,
      },
      {
        path: 'order-summary',
        element: <OrderHistory />,
      },
      {
        path: 'add-recipe',
        // element: <AddRecipePage />,
        element: <ProtectedRoute requiredRole="CASHIER" component={AddRecipePage} />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
      },
      {
        path: 'cashier/edit-recipe/:id', 
        // element: <EditRecipePage />,
        element: <ProtectedRoute requiredRole="CASHIER" component={EditRecipePage} />,
      },
      { path: 'cashier/recipes', 
        element: <ProtectedRoute requiredRole="CASHIER" component={RecipeListPage} /> },
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