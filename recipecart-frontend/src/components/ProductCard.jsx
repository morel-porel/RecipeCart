import React, { useState } from 'react';

function ProductCard({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-card">
      <h4>{product.name}</h4>
      <p>₱{product.price}</p>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button onClick={() => addToCart(product, quantity)}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
