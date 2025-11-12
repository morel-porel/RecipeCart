function FilterSidebar() {
  return (
    <aside className="filter-sidebar">
      <h3>Filter Recipes</h3>
      <h4>Diet</h4>
      <ul>
        <li>Dairy Free</li>
        <li>Egg Free</li>
        {/* Add more filter options here */}
      </ul>
    </aside>
  );
}
export default FilterSidebar;