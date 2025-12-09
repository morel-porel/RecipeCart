import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from './InputField';
import Button from './Button';
import Logo from './Logo';
import { usePopup } from '../components/CustomPopup';

function LoginForm() {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showPopup } = usePopup();

  const API_BASE_URL = 'http://localhost:8080/api';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (!emailOrUsername || !password) {
      setError('Please enter both email/username and password');
      return;
    }

    setLoading(true);

    try {
      // Call login API
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        emailOrUsername: emailOrUsername,
        password: password
      });

      const user = response.data;
      console.log('Login successful:', user);

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role); // Store role separately for easy access

      // Show success message
      showPopup(`Logged in successfully as ${user.role}!`, 'success');

      // Route based on user role
      routeByRole(user.role);

    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email/username or password');
      } else if (err.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Login failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Route user to appropriate page based on their role
   */
  const routeByRole = (role) => {
    switch(role?.toUpperCase()) {
      case 'CASHIER':
        navigate('/cashier/dashboard');
        break;
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'USER':
      case 'CUSTOMER':
      default:
        navigate('/home');
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Logo isColorful={true} />
      <h1>Welcome Back</h1>
      
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <InputField
        type="text"
        placeholder="Enter email or username"
        value={emailOrUsername}
        onChange={(e) => setEmailOrUsername(e.target.value)}
        required
      />
      <InputField
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <a href="#" className="forgot-password-link">Forgot Password</a>
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </Button>
      <p className="auth-switch-text">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </form>
  );
}

export default LoginForm;