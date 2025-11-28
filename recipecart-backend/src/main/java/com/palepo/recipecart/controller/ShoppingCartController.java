package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.ShoppingCart;
import com.palepo.recipecart.service.ShoppingCartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class ShoppingCartController {

    private final ShoppingCartService cartService;

    public ShoppingCartController(ShoppingCartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Get user's shopping cart
     * GET /api/cart/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ShoppingCart> getCart(@PathVariable Long userId) {
        ShoppingCart cart = cartService.getOrCreateCart(userId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Add item to cart
     * POST /api/cart/{userId}/items
     * Body: { "ingredientId": 1, "quantity": 2, "recipeSource": "Spaghetti Carbonara" }
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<ShoppingCart> addItemToCart(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {
        
        Long ingredientId = Long.valueOf(request.get("ingredientId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        String recipeSource = request.containsKey("recipeSource") ? 
                              request.get("recipeSource").toString() : null;
        
        ShoppingCart cart = cartService.addItemToCart(userId, ingredientId, quantity, recipeSource);
        return ResponseEntity.ok(cart);
    }

    /**
     * Update cart item quantity
     * PUT /api/cart/{userId}/items/{cartItemId}
     * Body: { "quantity": 5 }
     */
    @PutMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<ShoppingCart> updateCartItem(
            @PathVariable Long userId,
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> request) {
        
        Integer quantity = request.get("quantity");
        ShoppingCart cart = cartService.updateCartItemQuantity(userId, cartItemId, quantity);
        return ResponseEntity.ok(cart);
    }

    /**
     * Remove item from cart
     * DELETE /api/cart/{userId}/items/{cartItemId}
     */
    @DeleteMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<ShoppingCart> removeItemFromCart(
            @PathVariable Long userId,
            @PathVariable Long cartItemId) {
        
        ShoppingCart cart = cartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Clear entire cart
     * DELETE /api/cart/{userId}
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * View cart with total
     * GET /api/cart/{userId}/summary
     */
    @GetMapping("/{userId}/summary")
    public ResponseEntity<CartSummary> getCartSummary(@PathVariable Long userId) {
        ShoppingCart cart = cartService.viewCart(userId);
        double total = cart.calculateTotal();
        int itemCount = cart.getItems().size();
        
        return ResponseEntity.ok(new CartSummary(cart, total, itemCount));
    }

    // Inner class for cart summary response
    public static class CartSummary {
        private ShoppingCart cart;
        private double total;
        private int itemCount;

        public CartSummary(ShoppingCart cart, double total, int itemCount) {
            this.cart = cart;
            this.total = total;
            this.itemCount = itemCount;
        }

        public ShoppingCart getCart() {
            return cart;
        }

        public double getTotal() {
            return total;
        }

        public int getItemCount() {
            return itemCount;
        }
    }
}