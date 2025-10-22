import { useState } from 'react';
import OnboardingLayout from '../components/OnboardingLayout';
import PreferenceOption from '../components/PreferenceOption';
import { allergyOptions, dietOptions, cuisineOptions } from '../data/preferenceData';
import colorfulLogo from '../assets/images/logo.svg'; // Reuse your logo

function PreferencesPage() {
  const [selectedAllergies, setSelectedAllergies] = useState(new Set());
  const [selectedDiets, setSelectedDiets] = useState(new Set());
  const [selectedCuisines, setSelectedCuisines] = useState(new Set());

  // Generic handler to toggle items in a Set
  const handleToggle = (setter, state, value) => {
    const newSet = new Set(state);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setter(newSet);
  };
  
  const handleSave = () => {
    const preferences = {
        allergies: Array.from(selectedAllergies),
        diets: Array.from(selectedDiets),
        cuisines: Array.from(selectedCuisines),
    };
    console.log("Saving Preferences:", preferences);
    // Here you would navigate to the main app, e.g., navigate('/dashboard');
  }

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
          <a href="#" className="skip-link">Skip for now →</a>
          <button className="save-button" onClick={handleSave}>Save & Continue</button>
        </footer>
      </div>
    </OnboardingLayout>
  );
}

export default PreferencesPage;