import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import { dietOptions, allergyOptions, cuisineOptions } from '../data/preferenceData';
import '../assets/styles/AddRecipePage.css';

function AddRecipePage() {
  const navigate = useNavigate();

  // Basic Info
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Nutrition Facts
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');

  // Tags
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [selectedAllergens, setSelectedAllergens] = useState(new Set());

  // Ingredients
  const [recipeIngredients, setRecipeIngredients] = useState([
    { ingredientId: '', quantity: '', unit: '' }
  ]);
  const [masterIngredientList, setMasterIngredientList] = useState([]);

  // Fetch and Sort Ingredients
  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/ingredients');
        // Sort ingredients alphabetically by name
        const sortedList = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setMasterIngredientList(sortedList);
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      }
    };
    fetchAllIngredients();
  }, []);

  // Handle Ingredient Selection
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...recipeIngredients];
    updatedIngredients[index][field] = value;

    if (field === 'ingredientId') {
      const selectedIng = masterIngredientList.find(ing => ing.id === parseInt(value));
      if (selectedIng) {
        updatedIngredients[index].unit = selectedIng.unit;
      } else {
        updatedIngredients[index].unit = '';
      }
    }

    setRecipeIngredients(updatedIngredients);
  };

  const addIngredientField = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientId: '', quantity: '', unit: '' }]);
  };

  const removeIngredientField = (index) => {
    const updatedIngredients = recipeIngredients.filter((_, i) => i !== index);
    setRecipeIngredients(updatedIngredients);
  };

  // Helper for Checkboxes
  const toggleSetItem = (setter, currentSet, item) => {
    const newSet = new Set(currentSet);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setter(newSet);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Construct the Nutrition JSON string automatically
    const nutritionJson = JSON.stringify({
      calories: { display: `${calories} kcal`, value: parseInt(calories) },
      carbohydrates: { display: `${carbs} g`, value: parseInt(carbs) },
      protein: { display: `${protein} g`, value: parseInt(protein) },
      fat: { display: `${fat} g`, value: parseInt(fat) }
    });

    const newRecipeData = {
      name,
      instructions,
      nutritionFacts: nutritionJson, // Send the constructed JSON
      cuisine,
      imageUrl,
      dietaryTags: Array.from(selectedTags),
      allergenInfo: Array.from(selectedAllergens),
      recipeIngredients: recipeIngredients.map(ing => ({
        ingredient: { id: parseInt(ing.ingredientId) },
        quantity: parseFloat(ing.quantity),
        unit: ing.unit,
      })),
    };

    try {
      await axios.post('http://localhost:8080/api/recipes', newRecipeData);
      alert('Recipe created successfully!');
      navigate('/home');
    } catch (error) {
      console.error("Failed to create recipe:", error.response?.data || error.message);
      alert('Error creating recipe. Check console for details.');
    }
  };

  return (
    <div>
      <MainNavbar />
      <div className="add-recipe-container">
        <h1>Add a New Recipe</h1>
        <form onSubmit={handleSubmit} className="add-recipe-form">
          
          {/* --- Section 1: Basic Info --- */}
          <div className="form-section">
            <h3>Basic Details</h3>
            <input 
              type="text" 
              placeholder="Recipe Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
            
            <select value={cuisine} onChange={e => setCuisine(e.target.value)} required>
              <option value="">Select Cuisine</option>
              {cuisineOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <input 
              type="url" 
              placeholder="Image URL (e.g., https://images.unsplash.com/...)" 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
            />
            {imageUrl && <img src={imageUrl} alt="Preview" className="image-preview" />}
          </div>

          {/* --- Section 2: Instructions --- */}
          <div className="form-section">
            <h3>Instructions</h3>
            <textarea 
              placeholder="Step 1: Chop vegetables...&#10;Step 2: Boil water..." 
              value={instructions} 
              onChange={e => setInstructions(e.target.value)} 
              required 
            />
            <small>Enter each step on a new line.</small>
          </div>

          {/* --- Section 3: Nutrition Facts (User Friendly Inputs) --- */}
          <div className="form-section">
            <h3>Nutrition Facts (per serving)</h3>
            <div className="nutrition-grid">
              <div className="input-group">
                <label>Calories</label>
                <input type="number" value={calories} onChange={e => setCalories(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Carbs (g)</label>
                <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Protein (g)</label>
                <input type="number" value={protein} onChange={e => setProtein(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Fat (g)</label>
                <input type="number" value={fat} onChange={e => setFat(e.target.value)} required />
              </div>
            </div>
          </div>

          {/* --- Section 4: Ingredients --- */}
          <div className="form-section">
            <h3>Ingredients</h3>
            {recipeIngredients.map((ing, index) => (
              <div key={index} className="ingredient-row">
                <select 
                  value={ing.ingredientId} 
                  onChange={e => handleIngredientChange(index, 'ingredientId', e.target.value)} 
                  required
                >
                  <option value="">Select Ingredient</option>
                  {masterIngredientList.map(masterIng => (
                    <option key={masterIng.id} value={masterIng.id}>{masterIng.name}</option>
                  ))}
                </select>
                
                <input 
                  type="number" 
                  placeholder="Qty" 
                  value={ing.quantity} 
                  onChange={e => handleIngredientChange(index, 'quantity', e.target.value)} 
                  required 
                  step="0.1"
                />
                
                {/* Unit is Read-Only and Auto-Filled */}
                <input 
                  type="text" 
                  placeholder="Unit" 
                  value={ing.unit} 
                  readOnly 
                  className="read-only-input"
                />

                {recipeIngredients.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeIngredientField(index)}>×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addIngredientField} className="secondary-btn">+ Add Ingredient</button>
          </div>

          {/* --- Section 5: Tags --- */}
          <div className="form-section">
            <h3>Dietary Tags</h3>
            <div className="tags-container">
              {dietOptions.map(option => (
                <label key={option.value} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedTags.has(option.value)}
                    onChange={() => toggleSetItem(setSelectedTags, selectedTags, option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <h3>Allergens (Contains)</h3>
            <div className="tags-container">
              {allergyOptions.map(option => (
                <label key={option.value} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedAllergens.has(option.value)}
                    onChange={() => toggleSetItem(setSelectedAllergens, selectedAllergens, option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="primary-btn save-btn">Save Recipe</button>
        </form>
      </div>
    </div>
  );
}

export default AddRecipePage;