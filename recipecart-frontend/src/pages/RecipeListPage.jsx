import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/RecipeListPage.css';

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      alert("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
        try {
            await axios.delete(`http://localhost:8080/api/recipes/${id}`);
            // Remove from local state to update UI without refresh
            setRecipes(recipes.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe.");
        }
    }
  };

  return (
    <div>
      <MainNavbar />
      <div className="recipe-manager-container">
        <div className="manager-header">
          {/* Back Button to Cashier Dashboard */}
          <button className="back-btn" onClick={() => navigate('/cashier')}>
            ← Back to Orders
          </button>
          <h1>Recipe Management</h1>
          {/* Optional: Add button here too if you want */}
          <button className="add-recipe-nav-btn" onClick={() => navigate('/add-recipe')}>
            + Add New Recipe
          </button>
        </div>

        {loading ? (
          <p>Loading recipes...</p>
        ) : (
          <table className="recipe-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Cuisine</th>
                <th>Dietary Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>
                    <img 
                        src={recipe.imageUrl || 'https://via.placeholder.com/60'} 
                        alt={recipe.name} 
                        className="recipe-thumbnail"
                    />
                  </td>
                  <td><strong>{recipe.name}</strong></td>
                  <td>{recipe.cuisine}</td>
                  <td>{recipe.dietaryTags?.join(', ')}</td>
                  <td>
                    <button 
                        className="edit-action-btn"
                        onClick={() => navigate(`/cashier/edit-recipe/${recipe.id}`)}
                    >
                      Edit
                    </button>
                    <button 
                        className="delete-action-btn"
                        onClick={() => handleDelete(recipe.id, recipe.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}