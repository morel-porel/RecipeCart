import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../assets/styles/RecipeDetail.css';

// A component for the Nutrition Fact bars
const NutritionBar = ({ label, displayValue, numericValue, max }) => {
  const percentage = Math.min((numericValue / max) * 100, 100);

  return (
    <div className="nutrition-item">
      <strong>{label}</strong>
      <span>{displayValue}</span>
      <div className="nutrition-bar">
        <div className="nutrition-bar-inner" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nutritionData, setNutritionData] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/recipes/${id}`);
        if (!response.ok) throw new Error('Recipe not found');
        const data = await response.json();
        setRecipe(data);
        if (data.nutritionFacts) {
          try {
            const parsedNutrition = JSON.parse(data.nutritionFacts);
            setNutritionData(parsedNutrition);
          } catch (e) {
            console.error("Failed to parse nutrition facts JSON:", e);
            setNutritionData(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleAddIngredientsToCart = () => {
    console.log("Adding ingredients to cart:", recipe.recipeIngredients);
    alert("Ingredients added to cart! (Check console for details)");
  };

  if (loading) {
    return (
      <>
        <MainNavbar />
        <div>Loading...</div>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <MainNavbar />
        <div>Recipe not found!</div>
      </>
    );
  }

  return (
    <div className="recipe-detail-page">
      <MainNavbar />
      
      {/* Header Banner Image */}
      <div 
        className="recipe-detail-header" 
        style={{ backgroundImage: `url(${recipe.imageUrl || 'https://via.placeholder.com/1200x450'})` }}
      ></div>

      <div className="recipe-detail-content">
        {/* Left Sidebar: Nutrition Facts */}
        <aside className="nutrition-sidebar">
          <h2>Nutrition Facts</h2>
          {nutritionData ? (
            <>
              <div className="nutrition-item">
                <strong>Calories</strong>
                <span>{nutritionData.calories.display}</span>
                 <div className="nutrition-bar">
                    <div className="nutrition-bar-inner" style={{ width: `${(nutritionData.calories.value / 1000) * 100}%` }}></div>
                </div>
              </div>
              <NutritionBar label="Carbohydrates" displayValue={nutritionData.carbohydrates.display} numericValue={nutritionData.carbohydrates.value} max={100} />
              <NutritionBar label="Protein" displayValue={nutritionData.protein.display} numericValue={nutritionData.protein.value} max={50} />
              <NutritionBar label="Fat" displayValue={nutritionData.fat.display} numericValue={nutritionData.fat.value} max={70} />
            </>
          ) : (
            <p>{recipe.nutritionFacts}</p> // Fallback to show the raw string if parsing fails
          )}
        </aside>

        {/* Main Content Area */}
        <main className="recipe-main-content">
          <section className="recipe-title-section">
            <h1>{recipe.name}</h1>
            <div className="recipe-tags">
              {recipe.dietaryTags?.map(tag => <span key={tag} className="recipe-tag">{tag}</span>)}
              {recipe.allergenInfo?.map(allergen => <span key={allergen} className="recipe-tag">{allergen.replace(/_/g, ' ')}-Free</span>)}
            </div>
          </section>

          <section className="ingredients-section">
            <div className="ingredients-section-header">
              <h2>Ingredients</h2>
              <button className="add-to-cart-btn" onClick={handleAddIngredientsToCart}>
                Add Ingredients to Cart
              </button>
            </div>
            <ul className="ingredients-list">
              {recipe.recipeIngredients?.map(item => (
                <li key={item.id}>
                  {item.quantity} {item.unit} {item.ingredient.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="instructions-section">
            <h2>Recipe</h2>
            <ol>
              {recipe.instructions?.split('\n').map((step, index) => (
                step.trim() && <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
}

export default RecipeDetailPage;