import { useState, useEffect } from 'react';
import MainNavbar from '../components/MainNavbar';
import HeroSection from '../components/HeroSection';
import FilterSidebar from '../components/FilterSidebar';
import RecipeGrid from '../components/RecipeGrid';
import '../assets/styles/HomePage.css';

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for the text in the search bar
  const [searchTerm, setSearchTerm] = useState('');
  // State to hold all active filters
  const [activeFilters, setActiveFilters] = useState({
    cuisine: null,
    dietaryTags: null,
    excludeAllergen: null,
  });
  // This effect re-runs whenever the activeFilters state changes
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      // Build the query string from active filters
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('name', searchTerm);
      } else {
        if (activeFilters.cuisine) params.append('cuisine', activeFilters.cuisine);
        if (activeFilters.dietaryTags) params.append('dietaryTags', activeFilters.dietaryTags);
        if (activeFilters.excludeAllergen) params.append('excludeAllergen', activeFilters.excludeAllergen);
      }
      try {
        const response = await fetch(`http://localhost:8080/api/recipes?${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [activeFilters, searchTerm]); // The dependency array ensures this runs when filters or search change
  // Handler function to be passed to the sidebar
  const handleFilterChange = (filterKey, value) => {
    setSearchTerm(''); // Clear the search term when a filter is changed
    setActiveFilters(prevFilters => {
      // If the user clicks the same filter again, toggle it off
      if (filterKey === 'clear') {
        return { cuisine: null, dietaryTags: null, excludeAllergen: null };
      }
      if (prevFilters[filterKey] === value) {
        return { ...prevFilters, [filterKey]: null };
      }
      // Set the new filter
      return { ...prevFilters, [filterKey]: value };
    });
  };

  const handleSearch = (term) => {
    // Clear sidebar filters when a search is performed
    setActiveFilters({ cuisine: null, dietaryTags: null, excludeAllergen: null });
    setSearchTerm(term);
  };

  return (
    <div className="home-page">
      <MainNavbar 
        onSearch={handleSearch}
        initialSearchTerm={searchTerm}
      />
      <HeroSection />
      <main className="main-content-area">
        <FilterSidebar
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
        <div className="recipes-area">
          <h2>Recipes</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <RecipeGrid recipes={recipes} />
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;