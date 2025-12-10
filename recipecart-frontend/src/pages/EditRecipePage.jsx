import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/MainNavbar';
import { dietOptions, allergyOptions, cuisineOptions } from '../data/preferenceData';
import '../assets/styles/AddRecipePage.css';

function EditRecipePage() {
	const { id } = useParams(); // Get ID from URL
	const navigate = useNavigate();

	// --- State Management (Same as Add Page) ---
	const [name, setName] = useState('');
	const [instructions, setInstructions] = useState('');
	const [cuisine, setCuisine] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	// Nutrition
	const [calories, setCalories] = useState('');
	const [carbs, setCarbs] = useState('');
	const [protein, setProtein] = useState('');
	const [fat, setFat] = useState('');

	// Tags
	const [selectedTags, setSelectedTags] = useState(new Set());
	const [selectedAllergens, setSelectedAllergens] = useState(new Set());

	// Ingredients
	const [recipeIngredients, setRecipeIngredients] = useState([]);
	const [masterIngredientList, setMasterIngredientList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// --- 1. Fetch Ingredients Master List ---
	useEffect(() => {
		const fetchMasterList = async () => {
			try {
				const response = await axios.get('http://localhost:8080/api/ingredients');
				const sortedList = response.data.sort((a, b) => a.name.localeCompare(b.name));
				setMasterIngredientList(sortedList);
			} catch (error) {
				console.error("Failed to fetch ingredients list:", error);
			}
		};
		fetchMasterList();
	}, []);

	// --- 2. Fetch Existing Recipe Data & Pre-fill Form ---
	useEffect(() => {
		const fetchRecipe = async () => {
			try {
				const response = await axios.get(`http://localhost:8080/api/recipes/${id}`);
				const data = response.data;

				// Basic Fields
				setName(data.name);
				setInstructions(data.instructions);
				setCuisine(data.cuisine);
				setImageUrl(data.imageUrl);

				// Tags
				setSelectedTags(new Set(data.dietaryTags));
				setSelectedAllergens(new Set(data.allergenInfo));

				// Ingredients
				// Transform backend structure back to form structure
				const formattedIngredients = data.recipeIngredients.map(ri => ({
					ingredientId: ri.ingredient.id,
					quantity: ri.quantity,
					unit: ri.unit
				}));
				setRecipeIngredients(formattedIngredients);

				// Nutrition (Parse JSON)
				if (data.nutritionFacts) {
					try {
						const nut = JSON.parse(data.nutritionFacts);
						setCalories(nut.calories.value);
						setCarbs(nut.carbohydrates.value);
						setProtein(nut.protein.value);
						setFat(nut.fat.value);
					} catch (e) {
						console.error("Error parsing nutrition JSON", e);
					}
				}

				setIsLoading(false);
			} catch (error) {
				console.error("Failed to fetch recipe details:", error);
				alert("Could not load recipe.");
			}
		};

		fetchRecipe();
	}, [id]);

	// --- Handlers (Identical to Add Page) ---
	const handleIngredientChange = (index, field, value) => {
		const updatedIngredients = [...recipeIngredients];
		updatedIngredients[index][field] = value;

		if (field === 'ingredientId') {
			const selectedIng = masterIngredientList.find(ing => ing.id === parseInt(value));
			if (selectedIng) {
				updatedIngredients[index].unit = selectedIng.unit;
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

	const toggleSetItem = (setter, currentSet, item) => {
		const newSet = new Set(currentSet);
		if (newSet.has(item)) newSet.delete(item);
		else newSet.add(item);
		setter(newSet);
	};

	// --- Submit Logic (PUT Request) ---
	const handleSubmit = async (e) => {
		e.preventDefault();

		const nutritionJson = JSON.stringify({
			calories: { display: `${calories} kcal`, value: parseInt(calories) },
			carbohydrates: { display: `${carbs} g`, value: parseInt(carbs) },
			protein: { display: `${protein} g`, value: parseInt(protein) },
			fat: { display: `${fat} g`, value: parseInt(fat) }
		});

		const updatedRecipeData = {
			name,
			instructions,
			nutritionFacts: nutritionJson,
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
			// CHANGE: Use PUT instead of POST
			await axios.put(`http://localhost:8080/api/recipes/${id}`, updatedRecipeData);
			alert('Recipe updated successfully!');
			navigate(`/cashier/recipes`); // Go back to the recipe page
		} catch (error) {
			console.error("Failed to update recipe:", error);
			alert('Error updating recipe.');
		}
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<div>
			<MainNavbar />
			<div className="add-recipe-container">
                <button 
                    className="back-btn" 
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
				<h1>Edit Recipe</h1>
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
						<textarea value={instructions} onChange={e => setInstructions(e.target.value)} required />
					</div>

					{/* 3. Nutrition */}
					<div className="form-section">
						<h3>Nutrition Facts</h3>
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

					{/* 4. Ingredients */}
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
								<input type="text" placeholder="Unit" value={ing.unit} readOnly className="read-only-input"/>

								<button type="button" className="remove-btn" onClick={() => removeIngredientField(index)}>×</button>
							</div>
						))}
						<button type="button" onClick={addIngredientField} className="secondary-btn">+ Add Ingredient</button>
					</div>

					{/* 5. Tags */}
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

						<h3>Contains (Allergens)</h3> 
						<div className="tags-container">
							{allergyOptions.map(option => (
								<label key={option.value} className="checkbox-label">
									<input 
										type="checkbox" 
										checked={selectedAllergens.has(option.value)}
										onChange={() => toggleSetItem(setSelectedAllergens, selectedAllergens, option.value)}
									/>
									{option.label.replace('-free', '')} 
								</label>
							))}
						</div>
					</div>

					<button type="submit" className="primary-btn save-btn">Update Recipe</button>
				</form>
			</div>
		</div>
	);
}

export default EditRecipePage;