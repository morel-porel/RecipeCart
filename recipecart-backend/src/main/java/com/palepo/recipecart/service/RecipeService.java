package com.palepo.recipecart.service;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.entity.Recipe;
import com.palepo.recipecart.repository.RecipeRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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

            boolean hasAnyFilter = (cuisine != null && !cuisine.trim().isEmpty()) ||
                    (dietaryTags != null && !dietaryTags.isEmpty()) ||
                    (excludeAllergen != null && !excludeAllergen.trim().isEmpty());

            if (hasAnyFilter) {
                // Call your single, powerful custom method
                return recipeRepository.findRecipesByFilters(cuisine, dietaryTags, excludeAllergen);
            } else {
                // If no filters are provided, return everything
                return recipeRepository.findAll();
            }
    }

    @Transactional // Good practice for methods that modify data
    public Recipe updateRecipe(Long id, Recipe recipeDetails) {
        // 1. Find the existing recipe in the database
        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found with ID: " + id));

        // 2. Update the fields of the existing recipe with the new details
        existingRecipe.setName(recipeDetails.getName());
        existingRecipe.setInstructions(recipeDetails.getInstructions());
        existingRecipe.setNutritionFacts(recipeDetails.getNutritionFacts());
        existingRecipe.setCuisine(recipeDetails.getCuisine());

        existingRecipe.getDietaryTags().clear();
        existingRecipe.getDietaryTags().addAll(recipeDetails.getDietaryTags());

        existingRecipe.getAllergenInfo().clear();
        existingRecipe.getAllergenInfo().addAll(recipeDetails.getAllergenInfo());

        // 3. Save the updated recipe back to the database
        return recipeRepository.save(existingRecipe);
    }

    public void deleteRecipe(Long id) {
        // 1. Check if the recipe exists before trying to delete it
        if (!recipeRepository.existsById(id)) {
            throw new EntityNotFoundException("Recipe not found with ID: " + id);
        }
        // 2. Delete the recipe
        recipeRepository.deleteById(id);
    }

}
