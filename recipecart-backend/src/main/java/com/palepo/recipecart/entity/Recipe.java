package com.palepo.recipecart.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Recipe name cannot be blank")
    @Size(min = 3, max = 100, message = "Recipe name must be between 3 and 100 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Instructions cannot be blank")
    @Lob
    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "nutrition_facts")
    private String nutritionFacts;

    @NotBlank(message = "Cuisine cannot be blank")
    private String cuisine;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_dietary_tags", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "tag")
    private Set<String> dietaryTags;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_allergens", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "allergen")
    private Set<String> allergenInfo;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<RecipeIngredient> recipeIngredients;

    @Column(name = "image_url")
    private String imageUrl;

    public Recipe() {
    }

    public Recipe(Long id, String name, String instructions, String nutritionFacts, String cuisine, Set<String> dietaryTags, Set<String> allergenInfo, List<RecipeIngredient> recipeIngredients, String imageUrl) {
        this.id = id;
        this.name = name;
        this.instructions = instructions;
        this.nutritionFacts = nutritionFacts;
        this.cuisine = cuisine;
        this.dietaryTags = dietaryTags;
        this.allergenInfo = allergenInfo;
        this.recipeIngredients = recipeIngredients;
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getNutritionFacts() {
        return nutritionFacts;
    }

    public void setNutritionFacts(String nutritionFacts) {
        this.nutritionFacts = nutritionFacts;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public Set<String> getDietaryTags() {
        return dietaryTags;
    }

    public void setDietaryTags(Set<String> dietaryTags) {
        this.dietaryTags = dietaryTags;
    }

    public Set<String> getAllergenInfo() {
        return allergenInfo;
    }

    public void setAllergenInfo(Set<String> allergenInfo) {
        this.allergenInfo = allergenInfo;
    }

    public List<RecipeIngredient> getRecipeIngredients() {
        return recipeIngredients;
    }

    public void setRecipeIngredients(List<RecipeIngredient> recipeIngredients) {
        this.recipeIngredients = recipeIngredients;
    }
}