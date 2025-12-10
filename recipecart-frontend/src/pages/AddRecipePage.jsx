import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import { dietOptions, allergyOptions, cuisineOptions } from '../data/preferenceData';
import '../assets/styles/AddRecipePage.css';
import { usePopup } from '../components/CustomPopup';

function AddRecipePage() {
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // --- State Management ---
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Nutrition (Individual fields for better UX)
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');

  // Tags
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [selectedAllergens, setSelectedAllergens] = useState(new Set());

  // Ingredients
  const [recipeIngredients, setRecipeIngredients] = useState([
    { ingredientId: '', quantity: '', unit: '' } // Unit starts empty
  ]);
  const [masterIngredientList, setMasterIngredientList] = useState([]);

  // --- Fetch Ingredients on Load ---
  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/ingredients');
        // Sort alphabetically for easier searching
        const sortedList = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setMasterIngredientList(sortedList);
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      }
    };
    fetchAllIngredients();
  }, []);

  // --- Handlers ---

  // Handle Ingredient Logic (Auto-fill Unit)
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...recipeIngredients];
    updatedIngredients[index][field] = value;

    // Auto-fill unit when an ingredient is chosen
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
    const list = [...recipeIngredients];
    list.splice(index, 1);
    setRecipeIngredients(list);
  };

  // Toggle Checkboxes
  const toggleSetItem = (setter, currentSet, item) => {
    const newSet = new Set(currentSet);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setter(newSet);
  };

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Construct JSON for Nutrition
    const nutritionJson = JSON.stringify({
      calories: { display: `${calories} kcal`, value: parseInt(calories) },
      carbohydrates: { display: `${carbs} g`, value: parseInt(carbs) },
      protein: { display: `${protein} g`, value: parseInt(protein) },
      fat: { display: `${fat} g`, value: parseInt(fat) }
    });

    // 2. Build Payload
    const newRecipeData = {
      name,
      instructions,
      nutritionFacts: nutritionJson,
      cuisine,
      imageUrl,
      dietaryTags: Array.from(selectedTags),
      allergenInfo: Array.from(selectedAllergens), // This sends ["GLUTEN", "DAIRY"] etc.
      recipeIngredients: recipeIngredients.map(ing => ({
        ingredient: { id: parseInt(ing.ingredientId) },
        quantity: parseFloat(ing.quantity),
        unit: ing.unit,
      })),
    };

    // 3. Send to Backend
    try {
      await axios.post('http://localhost:8080/api/recipes', newRecipeData);
      showPopup('Recipe created successfully!', 'success');
      navigate('/cashier');
    } catch (error) {
      console.error("Failed to create recipe:", error);
      showPopup('Error creating recipe.', 'error');
    }
  };

  return (
    <div>
      <MainNavbar />
      <div className="add-recipe-container">
        <h1>Add a New Recipe</h1>
        <form onSubmit={handleSubmit} className="add-recipe-form">
          
          {/* 1. Basic Info */}
          <div className="form-section">
            <h3>Basic Details</h3>
            <input type="text" placeholder="Recipe Name" value={name} onChange={e => setName(e.target.value)} required />
            
            <select value={cuisine} onChange={e => setCuisine(e.target.value)} required>
              <option value="">Select Cuisine</option>
              {cuisineOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <input type="url" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            {imageUrl && <img src={imageUrl} alt="Preview" className="image-preview" />}
          </div>

          {/* 2. Instructions */}
          <div className="form-section">
            <h3>Instructions</h3>
            <textarea 
              placeholder="Step 1...&#10;Step 2..." 
              value={instructions} 
              onChange={e => setInstructions(e.target.value)} 
              required 
            />
          </div>

          {/* 3. Nutrition (User Friendly Inputs) */}
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

          {/* 4. Ingredients (Auto-Unit & Sorted) */}
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
                
                <input type="number" placeholder="Qty" value={ing.quantity} onChange={e => handleIngredientChange(index, 'quantity', e.target.value)} required step="0.1"/>
                
                {/* READ ONLY UNIT */}
                <input type="text" placeholder="Unit" value={ing.unit} readOnly className="read-only-input"/>

                {recipeIngredients.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeIngredientField(index)}>×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addIngredientField} className="secondary-btn">+ Add Ingredient</button>
          </div>

          {/* 5. Tags & Allergens (THE FIX) */}
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

            {/* LOGIC FIX: Clarify we are checking for PRESENCE of allergen */}
            <h3>Contains (Allergens)</h3> 
            <div className="tags-container">
              {allergyOptions.map(option => (
                <label key={option.value} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedAllergens.has(option.value)}
                    onChange={() => toggleSetItem(setSelectedAllergens, selectedAllergens, option.value)}
                  />
                  {/* TEXT FIX: Strip "-free" so user sees "Gluten", not "Gluten-free" */}
                  {option.label.replace('-free', '')} 
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