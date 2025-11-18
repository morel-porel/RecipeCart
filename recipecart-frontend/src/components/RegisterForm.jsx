import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from './InputField';
import Button from './Button';
import Logo from './Logo';

function RegisterForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Call registration API
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username: username,
        email: email,
        password: password,
        role: 'USER'
      });

      console.log('Registration successful:', response.data);

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Show success message
      alert('Account created successfully!');

      // Navigate to preferences page
      navigate('/preferences');

    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle specific error messages from backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError('Username or email already exists');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later');
      } else {
        setError('Registration failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Logo isColorful={true} />
      <h1>Create Account</h1>
      
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
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <InputField
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        type="password"
        placeholder="Enter password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <InputField
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
      <p className="auth-switch-text">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </form>
  );
}

export default RegisterForm;