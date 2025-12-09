// recipecart-frontend/src/utils/priceUtils.js

/**
 * Converts base unit prices to display-friendly formats
 * Example: ₱0.22/g becomes ₱220/kg
 */
export const formatIngredientPrice = (ingredient) => {
  const { price, unit, name } = ingredient;
  
  // Define conversion rules for display
  const conversions = {
    'g': { display: 'kg', factor: 1000, label: 'per kg' },
    'ml': { display: 'L', factor: 1000, label: 'per liter' },
    'pcs': { display: 'pcs', factor: 1, label: 'each' },
    'cloves': { display: 'cloves', factor: 1, label: 'each' },
    'heads': { display: 'heads', factor: 1, label: 'each' },
    'bunches': { display: 'bunches', factor: 1, label: 'each' },
    'blocks': { display: 'blocks', factor: 1, label: 'each' },
    'cans': { display: 'cans', factor: 1, label: 'each' },
  };

  const conversion = conversions[unit] || { display: unit, factor: 1, label: 'per unit' };
  const displayPrice = price * conversion.factor;

  return {
    displayPrice: displayPrice,
    displayUnit: conversion.display,
    priceLabel: conversion.label,
    basePrice: price,
    baseUnit: unit,
    formattedPrice: `₱${displayPrice.toFixed(2)} ${conversion.label}`
  };
};

/**
 * Calculates item total based on quantity
 */
export const calculateItemTotal = (ingredient, quantity) => {
  return ingredient.price * quantity;
};

/**
 * Formats quantity with unit for display
 * Example: 150g, 2 pcs, 500ml
 */
export const formatQuantityWithUnit = (quantity, unit) => {
  // For weight/volume, show in larger units if appropriate
  if (unit === 'g' && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(2)} kg`;
  }
  if (unit === 'ml' && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(2)} L`;
  }
  
  return `${quantity} ${unit}`;
};

/**
 * Formats price for a specific quantity
 * Shows both the amount and what you're getting
 * Example: "150g for ₱33.00"
 */
export const formatPriceForQuantity = (ingredient, quantity) => {
  const total = calculateItemTotal(ingredient, quantity);
  const quantityStr = formatQuantityWithUnit(quantity, ingredient.unit);
  return `${quantityStr} for ₱${total.toFixed(2)}`;
};