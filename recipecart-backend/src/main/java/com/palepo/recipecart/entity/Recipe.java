package com.palepo.recipecart.entity;

import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "nutrition_facts")
    private String nutritionFacts;

    private String cuisine;

    @ElementCollection
    @CollectionTable(name = "recipe_dietary_tags", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "tag")
    private Set<String> dietaryTags;

    @Column(name = "allergen_info")
    private String allergenInfo;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredient> recipeIngredients;

    public Recipe() {
    }

    public Recipe(String name, String instructions, String nutritionFacts, String cuisine, Set<String> dietaryTags, String allergenInfo, List<RecipeIngredient> recipeIngredients) {
        this.name = name;
        this.instructions = instructions;
        this.nutritionFacts = nutritionFacts;
        this.cuisine = cuisine;
        this.dietaryTags = dietaryTags;
        this.allergenInfo = allergenInfo;
        this.recipeIngredients = recipeIngredients;
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

    public String getAllergenInfo() {
        return allergenInfo;
    }

    public void setAllergenInfo(String allergenInfo) {
        this.allergenInfo = allergenInfo;
    }

    public List<RecipeIngredient> getRecipeIngredients() {
        return recipeIngredients;
    }

    public void setRecipeIngredients(List<RecipeIngredient> recipeIngredients) {
        this.recipeIngredients = recipeIngredients;
    }
}