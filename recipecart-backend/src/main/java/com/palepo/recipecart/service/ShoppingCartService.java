package com.palepo.recipecart.service;

import com.palepo.recipecart.entity.*;
import com.palepo.recipecart.exception.CartNotFoundException;
import com.palepo.recipecart.exception.InsufficientStockException;
import com.palepo.recipecart.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShoppingCartService {

    private final ShoppingCartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;

    public ShoppingCartService(ShoppingCartRepository cartRepository,
                              CartItemRepository cartItemRepository,
                              UserRepository userRepository,
                              IngredientRepository ingredientRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.ingredientRepository = ingredientRepository;
    }

    /**
     * Get or create a shopping cart for a user
     */
    @Transactional
    public ShoppingCart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart(user);
                    return cartRepository.save(newCart);
                });
    }

    /**
     * Get user's cart
     */
    public ShoppingCart getCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found for user: " + userId));
    }

    /**
     * Add item to cart or update quantity if already exists
     */
    @Transactional
    public ShoppingCart addItemToCart(Long userId, Long ingredientId, Integer quantity) {
        ShoppingCart cart = getOrCreateCart(userId);
        
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new EntityNotFoundException("Ingredient not found with id: " + ingredientId));

        // Check if item already exists in cart
        CartItem existingItem = cartItemRepository.findByCartIdAndIngredientId(cart.getId(), ingredientId)
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            int newQuantity = existingItem.getQuantity() + quantity;
            
            // Check stock availability
            if (ingredient.getStockLevel() < newQuantity) {
                throw new InsufficientStockException(
                    "Insufficient stock for " + ingredient.getName() + 
                    ". Available: " + ingredient.getStockLevel()
                );
            }
            
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            // Check stock availability
            if (ingredient.getStockLevel() < quantity) {
                throw new InsufficientStockException(
                    "Insufficient stock for " + ingredient.getName() + 
                    ". Available: " + ingredient.getStockLevel()
                );
            }
            
            // Create new cart item
            CartItem newItem = new CartItem(cart, ingredient, quantity);
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        return cartRepository.save(cart);
    }

    /**
     * Update cart item quantity
     */
    @Transactional
    public ShoppingCart updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        ShoppingCart cart = getCart(userId);
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found with id: " + cartItemId));

        // Verify cart item belongs to user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to this user's cart");
        }

        // Check stock availability
        if (cartItem.getIngredient().getStockLevel() < quantity) {
            throw new InsufficientStockException(
                "Insufficient stock for " + cartItem.getIngredient().getName() + 
                ". Available: " + cartItem.getIngredient().getStockLevel()
            );
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return cartRepository.findById(cart.getId()).orElseThrow();
    }

    /**
     * Remove item from cart
     */
    @Transactional
    public ShoppingCart removeItemFromCart(Long userId, Long cartItemId) {
        ShoppingCart cart = getCart(userId);
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found with id: " + cartItemId));

        // Verify cart item belongs to user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to this user's cart");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        return cartRepository.findById(cart.getId()).orElseThrow();
    }

    /**
     * Clear all items from cart
     */
    @Transactional
    public void clearCart(Long userId) {
        ShoppingCart cart = getCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    /**
     * View cart with total
     */
    public ShoppingCart viewCart(Long userId) {
        return getCart(userId);
    }
}