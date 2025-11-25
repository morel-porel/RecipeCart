import { useState } from 'react';
import OnboardingLayout from '../components/OnboardingLayout';
import PreferenceOption from '../components/PreferenceOption';
import { allergyOptions, dietOptions, cuisineOptions } from '../data/preferenceData';
import colorfulLogo from '../assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import axios from 'axios'; // <-- ERROR #2 FIXED

function PreferencesPage() {
  const [selectedAllergies, setSelectedAllergies] = useState(new Set());
  const [selectedDiets, setSelectedDiets] = useState(new Set());
  const [selectedCuisines, setSelectedCuisines] = useState(new Set());

  const navigate = useNavigate();
  const { user } = useUser();

  const handleToggle = (setter, state, value) => {
    const newSet = new Set(state);
    newSet.has(value) ? newSet.delete(value) : newSet.add(value);
    setter(newSet);
  };

  // ERROR #1 FIXED: Added 'async'
  const handleSave = async () => { 
    if (!user || !user.id) {
      alert("No user is logged in. Redirecting to login.");
      navigate('/login');
      return;
    }

    // ERROR #3 FIXED: Corrected the keys to match the backend entity
    const preferences = {
      allergies: Array.from(selectedAllergies),
      dietaryPlan: selectedDiets.values().next().value || null, // Assuming one diet
      favoriteCuisines: Array.from(selectedCuisines),
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/users/${user.id}/profile`, preferences);
      
      console.log("Preferences saved:", response.data);
      navigate('/home'); // Redirect only on success

    } catch (error) {
      console.error('Failed to save preferences:', error.response?.data || error.message);
      alert('Failed to save preferences.');
    }
  };

  const handleSkip = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <OnboardingLayout>
      <div className="preferences-container">
        <header className="preferences-header">
          <div className="logo">
            <img src={colorfulLogo} alt="RecipeCart Logo" />
            <span>RecipeCart</span>
          </div>
          <h1>Tell us your food preferences</h1>
          <p>Choose what you like so we can personalize your recipes</p>
        </header>

        <section className="preference-section">
          <h2>Allergies</h2>
          <div className="options-grid">
            {allergyOptions.map(option => (
              <PreferenceOption
                key={option.value}
                label={option.label}
                isSelected={selectedAllergies.has(option.value)}
                onClick={() => handleToggle(setSelectedAllergies, selectedAllergies, option.value)}
              />
            ))}
          </div>
        </section>

        <section className="preference-section">
          <h2>Dietary Plan</h2>
          <div className="options-grid">
            {dietOptions.map(option => (
              <PreferenceOption
                key={option.value}
                label={option.label}
                isSelected={selectedDiets.has(option.value)}
                onClick={() => handleToggle(setSelectedDiets, selectedDiets, option.value)}
              />
            ))}
          </div>
        </section>

        <section className="preference-section">
          <h2>Cuisine</h2>
          <div className="options-grid">
            {cuisineOptions.map(option => (
              <PreferenceOption
                key={option.value}
                label={option.label}
                isSelected={selectedCuisines.has(option.value)}
                onClick={() => handleToggle(setSelectedCuisines, selectedCuisines, option.value)}
              />
            ))}
          </div>
        </section>

         <footer className="preferences-actions">
          <a href="#" onClick={handleSkip} className="skip-link">
            Skip for now →
          </a>

          <button className="save-button" onClick={handleSave}>
            Save & Continue
          </button>
        </footer>
      </div>
    </OnboardingLayout>
  );
}

export default PreferencesPage;