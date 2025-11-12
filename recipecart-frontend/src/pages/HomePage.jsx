import MainNavbar from '../components/MainNavbar';
import HeroSection from '../components/HeroSection';
import FilterSidebar from '../components/FilterSidebar';
import RecipeGrid from '../components/RecipeGrid';
import { mockRecipes } from '../data/mockData'; // Using mock data for now
import '../assets/styles/HomePage.css';
import { useState, useEffect } from 'react';

function HomePage() {
  const [recipes, setRecipes] = useState([]); // State to hold recipes
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    // This function runs when the component mounts
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/recipes');
        const data = await response.json();
        setRecipes(data); // Update state with API data
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []); // The empty array [] means this effect runs only once

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  return (
    <div className="home-page">
      <MainNavbar />
      <HeroSection />
      <main className="main-content">
        <FilterSidebar />
        <div className="recipes-area">
          <h2>Recipes</h2>
          <RecipeGrid recipes={mockRecipes} />
        </div>
      </main>
    </div>
  );
}

export default HomePage;