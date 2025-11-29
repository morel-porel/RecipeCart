import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import { useUser } from '../context/UserContext';
import '../assets/styles/RecipeDetail.css';
import { allergyOptions } from '../data/preferenceData';

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
  const navigate = useNavigate();
  const { user } = useUser();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const [nutritionData, setNutritionData] = useState(null);
  const [userAllergies, setUserAllergies] = useState([]);

  const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const currentUser = getUser();
    const userId = currentUser?.id || 1;
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    if (user && user.id) {
        axios.get(`${API_BASE_URL}/users/${user.id}/profile`)
            .then(res => {
                // Assuming the backend returns an object with an 'allergies' array
                setUserAllergies(res.data.allergies || []);
            })
            .catch(err => console.error("Error fetching user profile:", err));
    }
  }, [user]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
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

  const handleAddIngredientsToCart = async () => {
    if (!recipe || !recipe.recipeIngredients) {
      alert('No ingredients to add');
      return;
    }

    setAddingToCart(true);

    try {
      // Add each ingredient to the cart
      const addPromises = recipe.recipeIngredients.map(async (item) => {
        try {
          await axios.post(`${API_BASE_URL}/cart/${userId}/items`, {
            ingredientId: item.ingredient.id,
            quantity: Math.ceil(item.quantity), // Round up to nearest whole number
            recipeSource: recipe.name // Add recipe name to track source
          });
        } catch (error) {
          // If ingredient already in cart, it will update quantity
          console.error(`Error adding ${item.ingredient.name}:`, error);
          throw error;
        }
      });

      await Promise.all(addPromises);

      alert(`Successfully added ${recipe.recipeIngredients.length} ingredients to cart!`);
      
      // Ask user if they want to go to cart
      const goToCart = window.confirm('Ingredients added! Go to cart now?');
      if (goToCart) {
        navigate('/cart');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add ingredients to cart';
      alert(errorMessage);
      console.error('Error adding ingredients to cart:', error);
    } finally {
      setAddingToCart(false);
    }
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
            <p>{recipe.nutritionFacts}</p>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="recipe-main-content">
          <section className="recipe-title-section">
            <h1>{recipe.name}</h1>
            <div className="recipe-tags">
              {recipe.dietaryTags?.map(tag => (
                <span key={tag} className="recipe-tag">{tag}</span>
              ))}
              {allergyOptions
                .filter(option => !recipe.allergenInfo?.includes(option.value))
                .map(option => (
                  <span key={option.value} className="recipe-tag">
                    {option.label}
                  </span>
                ))
              }
              {recipe.allergenInfo?.map(allergen => {
                // Logic: Check if the logged-in user is allergic to THIS specific ingredient
                // We assume user.userProfile.allergies stores strings like "GLUTEN", "NUT", etc.
                // Adjust path to 'user.userProfile.allergies' based on your exact object structure
                const isUserAllergic = user?.userProfile?.allergies?.includes(allergen) || 
                                      user?.allergies?.includes(allergen); // Fallback check

                return (
                  <span 
                    key={allergen} 
                    className={`recipe-tag ${isUserAllergic ? 'danger' : 'warning'}`}
                  >
                    {isUserAllergic ? '⚠️ ' : ''} Contains: {allergen}
                  </span>
                );
              })}
            </div>
          </section>

          <section className="ingredients-section">
            <div className="ingredients-section-header">
              <h2>Ingredients</h2>
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddIngredientsToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add Ingredients to Cart'}
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