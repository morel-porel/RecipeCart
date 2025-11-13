import { dietOptions, allergyOptions, cuisineOptions } from '../data/preferenceData';

function FilterSidebar({ activeFilters, onFilterChange }) {
  // A helper function to create a filter section
  const renderFilterSection = (title, options, filterKey) => (
    <div className="filter-section">
      <h4>{title}</h4>
      <ul>
        {options.map(option => (
          <li
            key={option.value}
            className={activeFilters[filterKey] === option.value ? 'active' : ''}
            onClick={() => onFilterChange(filterKey, option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <aside className="filter-sidebar">
      <h3>Filter Recipes</h3>
      {renderFilterSection('Diet', dietOptions, 'dietaryTags')}
      {renderFilterSection('Allergies', allergyOptions, 'excludeAllergen')}
      {renderFilterSection('Cuisine', cuisineOptions, 'cuisine')}
      
      {/* A button to clear all filters */}
      <button onClick={() => onFilterChange('clear', null)}>Clear Filters</button>
    </aside>
  );
}

export default FilterSidebar;