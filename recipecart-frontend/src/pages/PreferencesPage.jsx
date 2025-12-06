import { useState, useEffect } from 'react';
import OnboardingLayout from '../components/OnboardingLayout';
import PreferenceOption from '../components/PreferenceOption';
import { allergyOptions, dietOptions, cuisineOptions } from '../data/preferenceData';
import colorfulLogo from '../assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import axios from 'axios';
import { usePopup } from '../components/CustomPopup';

function PreferencesPage() {
  const [selectedAllergies, setSelectedAllergies] = useState(new Set());
  const [selectedDiet, setSelectedDiet] = useState(''); // Changed to single value
  const [selectedCuisines, setSelectedCuisines] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();
  const navigate = useNavigate();
  const { user } = useUser();

  // Load existing preferences if editing
  useEffect(() => {
    const loadExistingPreferences = async () => {
      const storedUser = user || JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.id) {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/${storedUser.id}/profile`);
          const profile = response.data;
          
          if (profile.allergies) {
            setSelectedAllergies(new Set(profile.allergies));
          }
          if (profile.dietaryPlan) {
            setSelectedDiet(profile.dietaryPlan);
          }
          if (profile.favoriteCuisines) {
            setSelectedCuisines(new Set(profile.favoriteCuisines));
          }
        } catch (error) {
          console.log('No existing preferences found, starting fresh');
        }
      }
    };

    loadExistingPreferences();
  }, [user]);

  const handleAllergyToggle = (value) => {
    const newSet = new Set(selectedAllergies);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelectedAllergies(newSet);
  };

  const handleDietToggle = (value) => {
    // Only allow one diet selection
    if (selectedDiet === value) {
      setSelectedDiet(''); // Deselect if clicking the same one
    } else {
      setSelectedDiet(value);
    }
  };

  const handleCuisineToggle = (value) => {
    const newSet = new Set(selectedCuisines);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelectedCuisines(newSet);
  };

  const handleSave = async () => {
    const storedUser = user || JSON.parse(localStorage.getItem('user'));
    
    if (!storedUser || !storedUser.id) {
      showPopup("No user is logged in. Redirecting to login.", "error");
      navigate('/login');
      return;
    }

    // Prepare the data to match backend expectations
    const preferences = {
      allergies: Array.from(selectedAllergies),
      dietaryPlan: selectedDiet || null,
      favoriteCuisines: Array.from(selectedCuisines),
    };

    console.log('Saving preferences:', preferences); // Debug log

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8080/api/users/${storedUser.id}/profile`, 
        preferences
      );
      
      console.log("Preferences saved successfully:", response.data);
      showPopup('Preferences saved successfully!', 'success');
      navigate('/home');

    } catch (error) {
      console.error('Failed to save preferences:', error);
      showPopup('Failed to save preferences: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
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
                label={option.label.replace('-free', '')}
                isSelected={selectedAllergies.has(option.value)}
                onClick={() => handleAllergyToggle(option.value)}
              />
            ))}
          </div>
        </section>

        <section className="preference-section">
          <h2>Dietary Plan (Select One)</h2>
          <div className="options-grid">
            {dietOptions.map(option => (
              <PreferenceOption
                key={option.value}
                label={option.label}
                isSelected={selectedDiet === option.value}
                onClick={() => handleDietToggle(option.value)}
              />
            ))}
          </div>
        </section>

        <section className="preference-section">
          <h2>Favorite Cuisines</h2>
          <div className="options-grid">
            {cuisineOptions.map(option => (
              <PreferenceOption
                key={option.value}
                label={option.label}
                isSelected={selectedCuisines.has(option.value)}
                onClick={() => handleCuisineToggle(option.value)}
              />
            ))}
          </div>
        </section>

        <footer className="preferences-actions">
          <a href="#" onClick={handleSkip} className="skip-link">
            Skip for now →
          </a>

          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </footer>
      </div>
    </OnboardingLayout>
  );
}

export default PreferencesPage;