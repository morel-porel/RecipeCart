import { useParams } from 'react-router-dom';
import { mockRecipes } from '../data/mockData'; // Using mock data for now
import { useState, useEffect } from 'react';
function RecipeDetailPage() {
  const { id } = useParams(); // Gets the 'id' from the URL (e.g., /recipes/1)
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/recipes/${id}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]); // Rerun this effect if the ID in the URL changes

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!recipe) {
    return <div>Recipe not found!</div>;
  }

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>Cuisine: {recipe.cuisine}</p>
      <h2>Instructions</h2>
      <p>{recipe.instructions}</p>
      <h2>Nutrition</h2>
      <p>{recipe.nutritionFacts}</p>
    </div>
  );
}

export default RecipeDetailPage;