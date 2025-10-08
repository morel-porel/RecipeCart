// src/components/AuthLayout.jsx

import Logo from './Logo';
import '../assets/styles/Auth.css';

import groceryImage from '../assets/images/groceries2.png';

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout-left">
        <header>
          <Logo className="header-logo" />
        </header>
        <main className="form-container">
          {children}
        </main>
      </div>
      <div className="auth-layout-right">
        {/* 2. ADD the <img> tag here */}
        <img src={groceryImage} alt="A bag of fresh groceries" />
      </div>
    </div>
  );
}

export default AuthLayout;