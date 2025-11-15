import { useState } from 'react';
import { Link } from 'react-router-dom';

function MainNavbar({ onSearch }) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the form from causing a page reload
    onSearch(localSearchTerm); // Call the parent's handler function
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-logo">RecipeCart</Link>
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
        <span>🛒</span>
        <span>👤</span>
      </div>
    </nav>
  );
}

export default MainNavbar;