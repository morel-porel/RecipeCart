import { Link } from 'react-router-dom';

function MainNavbar() {
  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-logo">RecipeCart</Link>
        <div className="search-bar">
          <input type="text" placeholder="Search for recipes..." />
          <button>🔍</button>
        </div>
      </div>
      <div className="navbar-right">
        {/* We'll make these icons functional later */}
        <span>🛒</span>
        <span>👤</span>
      </div>
    </nav>
  );
}

export default MainNavbar;