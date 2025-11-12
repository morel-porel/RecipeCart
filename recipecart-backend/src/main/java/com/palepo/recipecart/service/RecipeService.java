package com.palepo.recipecart.service;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.entity.Recipe;
import com.palepo.recipecart.repository.RecipeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository){
        this.recipeRepository = recipeRepository;
    }
    public Recipe createRecipe(Recipe recipe){
        return recipeRepository.save(recipe);
    }
    public List<Recipe> getAllRecipes(){
        return recipeRepository.findAll();
    }
    public Recipe getRecipeById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found with ID: " + id));
    }
    /**
     * Searches for recipes based on optional filter criteria.
     * @param cuisine The cuisine to filter by (e.g., "Italian"). Can be null.
     * @param dietaryTags A set of dietary tags to filter by (e.g., "VEGAN"). Can be null or empty.
     * @return A list of recipes that match the filter criteria.
     */
    public List<Recipe> searchRecipes(String cuisine, Set<String> dietaryTags, String excludeAllergen) {
        boolean hasCuisine = cuisine != null && !cuisine.trim().isEmpty();
        boolean hasTags = dietaryTags != null && !dietaryTags.isEmpty();
        boolean hasAllergenExclusion = excludeAllergen != null && !excludeAllergen.trim().isEmpty();

        if (hasCuisine) {
            return recipeRepository.findByCuisineIgnoreCase(cuisine);
        }
        if (hasTags) {
            return recipeRepository.findByDietaryTagsIn(dietaryTags);
        }
        if (hasAllergenExclusion) {
            return recipeRepository.findAllByAllergenInfoNotContaining(excludeAllergen);
        }
            // If no filters, return everything
            return recipeRepository.findAll();
        }


}
