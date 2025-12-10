import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePopup } from '../components/CustomPopup';
import { useConfirm } from '../components/CustomConfirm';
import '../assets/styles/StockPage.css';

function StockPage() {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const { showConfirm } = useConfirm();
  
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    filterIngredients();
  }, [ingredients, searchTerm, stockFilter]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cashier/ingredients`);
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      showPopup('Failed to load ingredients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterIngredients = () => {
    let filtered = ingredients;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ing =>
        ing.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply stock level filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(ing => ing.stockLevel > 0 && ing.stockLevel <= 50);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(ing => ing.stockLevel === 0);
    }

    setFilteredIngredients(filtered);
  };

  const handleUpdateStock = async (ingredientId) => {
    const newStock = parseInt(editValue);
    
    if (isNaN(newStock) || newStock < 0) {
      showPopup('Please enter a valid stock level', 'error');
      return;
    }

    const confirmed = await showConfirm(
      `Update stock level to ${newStock}?`,
      'Confirm Stock Update'
    );

    if (!confirmed) return;

    try {
      await axios.put(
        `${API_BASE_URL}/cashier/ingredients/${ingredientId}/stock`,
        { stockLevel: newStock }
      );
      
      // Update local state
      setIngredients(prevIngredients =>
        prevIngredients.map(ing =>
          ing.id === ingredientId ? { ...ing, stockLevel: newStock } : ing
        )
      );
      
      setEditingId(null);
      setEditValue('');
      showPopup('Stock level updated successfully', 'success');
    } catch (error) {
      console.error('Error updating stock:', error);
      showPopup('Failed to update stock level', 'error');
    }
  };

  const startEditing = (ingredient) => {
    setEditingId(ingredient.id);
    setEditValue(ingredient.stockLevel.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const getStockStatus = (stockLevel) => {
    if (stockLevel === 0) return 'out-of-stock';
    if (stockLevel <= 50) return 'low-stock';
    return 'in-stock';
  };

  const getStockBadge = (stockLevel) => {
    if (stockLevel === 0) {
      return <span className="stock-badge out-of-stock">Out of Stock</span>;
    }
    if (stockLevel <= 50) {
      return <span className="stock-badge low-stock">Low Stock</span>;
    }
    return <span className="stock-badge in-stock">In Stock</span>;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="loading-spinner">Loading ingredients...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="stock-header">
          <div className="title-section">
            <button onClick={() => navigate('/cashier')} className="back-btn">
              ← Back
            </button>
            <h1 className="stock-title">Stock Management</h1>
          </div>

          {/* Search and Filters */}
          <div className="stock-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>🔍</button>
            </div>

            <div className="stock-filters">
              <button
                className={`filter-btn ${stockFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStockFilter('all')}
              >
                All Items ({ingredients.length})
              </button>
              <button
                className={`filter-btn ${stockFilter === 'low' ? 'active' : ''}`}
                onClick={() => setStockFilter('low')}
              >
                Low Stock ({ingredients.filter(i => i.stockLevel > 0 && i.stockLevel <= 50).length})
              </button>
              <button
                className={`filter-btn ${stockFilter === 'out' ? 'active' : ''}`}
                onClick={() => setStockFilter('out')}
              >
                Out of Stock ({ingredients.filter(i => i.stockLevel === 0).length})
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="stock-table-container">
          <table className="stock-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ingredient Name</th>
                <th>Unit</th>
                <th>Price per Unit</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No ingredients found
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className={getStockStatus(ingredient.stockLevel)}>
                    <td className="centered-cell">{ingredient.id}</td>
                    <td className="ingredient-name">{ingredient.name}</td>
                    <td className="centered-cell">{ingredient.unit}</td>
                    <td className="centered-cell">₱{ingredient.price.toFixed(2)}</td>
                    <td className="centered-cell">
                      {editingId === ingredient.id ? (
                        <input
                          type="number"
                          className="stock-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          min="0"
                          autoFocus
                        />
                      ) : (
                        <span className="stock-value">{ingredient.stockLevel}</span>
                      )}
                    </td>
                    <td className="centered-cell">
                      {getStockBadge(ingredient.stockLevel)}
                    </td>
                    <td className="centered-cell">
                      {editingId === ingredient.id ? (
                        <div className="action-buttons">
                          <button
                            className="save-btn"
                            onClick={() => handleUpdateStock(ingredient.id)}
                          >
                            ✓ Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={cancelEditing}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(ingredient)}
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="stock-summary">
          <div className="summary-card">
            <h3>Total Items</h3>
            <p className="summary-value">{ingredients.length}</p>
          </div>
          <div className="summary-card warning">
            <h3>Low Stock Items</h3>
            <p className="summary-value">
              {ingredients.filter(i => i.stockLevel > 0 && i.stockLevel <= 50).length}
            </p>
          </div>
          <div className="summary-card danger">
            <h3>Out of Stock</h3>
            <p className="summary-value">
              {ingredients.filter(i => i.stockLevel === 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockPage;