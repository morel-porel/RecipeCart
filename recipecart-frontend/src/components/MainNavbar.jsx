import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg';

function MainNavbar({ onSearch }) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the form from causing a page reload
    onSearch(localSearchTerm); // Call the parent's handler function
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#509E2F', fontSize: '1.5rem', fontWeight: 'bold' }}><img src={logo} alt="RecipeCart Logo" style={{ height: '40px', width: 'auto' }} />RecipeCart</Link>
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search for recipes..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>
      <div className="navbar-right">
        {/* We'll make these icons functional later */}
        <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>🛒</Link>
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>👤</Link>
      </div>
    </nav>
  );
}

export default MainNavbar;