package com.palepo.recipecart.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private ShoppingCart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingredient_id", nullable = false)
    @NotNull(message = "Ingredient must be specified")
    private Ingredient ingredient;

    @Column(nullable = false)
    @NotNull(message = "Quantity must be specified")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    // Track which recipe this item came from (optional)
    @Column(name = "recipe_source")
    private String recipeSource;

    public CartItem() {}

    public CartItem(ShoppingCart cart, Ingredient ingredient, Integer quantity) {
        this.cart = cart;
        this.ingredient = ingredient;
        this.quantity = quantity;
    }

    public CartItem(ShoppingCart cart, Ingredient ingredient, Integer quantity, String recipeSource) {
        this.cart = cart;
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.recipeSource = recipeSource;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ShoppingCart getCart() {
        return cart;
    }

    public void setCart(ShoppingCart cart) {
        this.cart = cart;
    }

    public Ingredient getIngredient() {
        return ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getRecipeSource() {
        return recipeSource;
    }

    public void setRecipeSource(String recipeSource) {
        this.recipeSource = recipeSource;
    }

    // Helper method to calculate item total
    public double getItemTotal() {
        return ingredient.getPrice() * quantity;
    }
}