import { Link } from 'react-router-dom';

import { useState } from 'react';
import InputField from './InputField';
import Button from './Button';
import Logo from './Logo';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // ** API CALL **
    console.log('Logging in with:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Logo isColorful={true} />
      <h1>Welcome Back</h1>
      <InputField
        type="email"
        placeholder="Enter email or username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <a href="#" className="forgot-password-link">Forgot Password</a>
      <Button type="submit">Log In</Button>
      <p className="auth-switch-text">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </form>
  );
}

export default LoginForm;