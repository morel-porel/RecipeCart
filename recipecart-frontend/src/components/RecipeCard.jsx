import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <img src={recipe.imageUrl} alt={recipe.name} />
      <div className="recipe-card-info">
        <h3>{recipe.name}</h3>
        <p>{recipe.cuisine}</p>
        {/* Add more info like time, rating etc. later */}
      </div>
    </Link>
  );
}

export default RecipeCard;