package com.palepo.recipecart.service;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.entity.Recipe;
import com.palepo.recipecart.entity.User;
import com.palepo.recipecart.entity.UserProfile;
import com.palepo.recipecart.repository.RecipeRepository;
import com.palepo.recipecart.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public RecipeService(RecipeRepository recipeRepository, UserRepository userRepository){
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }
    public Recipe createRecipe(Recipe recipe){
        if (recipe.getRecipeIngredients() != null) {
            for (var ri : recipe.getRecipeIngredients()) {
                ri.setRecipe(recipe); // Sets the recipe_id foreign key
            }
        }
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
    public List<Recipe> searchRecipes(String name, String cuisine, Set<String> dietaryTags, String excludeAllergen) {

        // ... name check logic remains the same ...
        if (name != null && !name.trim().isEmpty()) {
            return recipeRepository.findByNameContainingIgnoreCase(name);
        }

        // Convert single cuisine string to Set for compatibility with the new repo method
        Set<String> cuisineSet = null;
        if (cuisine != null && !cuisine.trim().isEmpty()) {
            cuisineSet = Set.of(cuisine);
        }

        boolean hasAnyFilter = (cuisineSet != null && !cuisineSet.isEmpty()) ||
                (dietaryTags != null && !dietaryTags.isEmpty()) ||
                (excludeAllergen != null && !excludeAllergen.trim().isEmpty());

        if (hasAnyFilter) {
            return recipeRepository.findRecipesByFilters(cuisineSet, dietaryTags, excludeAllergen);
        } else {
            return recipeRepository.findAll();
        }
    }

    @Transactional
    public Recipe updateRecipe(Long id, Recipe recipeDetails) {
        // 1. Find the existing recipe
        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found with ID: " + id));

        // 2. Update basic fields
        existingRecipe.setName(recipeDetails.getName());
        existingRecipe.setInstructions(recipeDetails.getInstructions());
        existingRecipe.setNutritionFacts(recipeDetails.getNutritionFacts());
        existingRecipe.setCuisine(recipeDetails.getCuisine());
        existingRecipe.setImageUrl(recipeDetails.getImageUrl());

        // 3. Update Collections (Tags & Allergens)
        existingRecipe.getDietaryTags().clear();
        if (recipeDetails.getDietaryTags() != null) {
            existingRecipe.getDietaryTags().addAll(recipeDetails.getDietaryTags());
        }

        existingRecipe.getAllergenInfo().clear();
        if (recipeDetails.getAllergenInfo() != null) {
            existingRecipe.getAllergenInfo().addAll(recipeDetails.getAllergenInfo());
        }

        // 4. Update Ingredients
        // We clear the current list and replace it with the new incoming list
        existingRecipe.getRecipeIngredients().clear();

        if (recipeDetails.getRecipeIngredients() != null) {
            for (var ri : recipeDetails.getRecipeIngredients()) {
                // IMPORTANT: We must re-link the child to the parent
                ri.setRecipe(existingRecipe);
                existingRecipe.getRecipeIngredients().add(ri);
            }
        }

        // 5. Save
        return recipeRepository.save(existingRecipe);
    }

    public void deleteRecipe(Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new EntityNotFoundException("Recipe not found with ID: " + id);
        }
        recipeRepository.deleteById(id);
    }

    public List<Recipe> getRecommendationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        UserProfile profile = user.getUserProfile();

        if (profile == null) {
            return Collections.emptyList();
        }

        // 1. Get ALL favorite cuisines
        Set<String> preferredCuisines = profile.getFavoriteCuisines(); // This returns a Set<String>

        // 2. Get Diet
        String dietaryPlan = profile.getDietaryPlan();
        Set<String> dietaryTags;
        if (dietaryPlan != null && !dietaryPlan.trim().isEmpty()) {
            dietaryTags = Set.of(dietaryPlan);
        } else {
            dietaryTags = Collections.emptySet();
        }

        // 3. Get Allergen
        String excludeAllergen = profile.getAllergies().stream()
                .findFirst()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .orElse(null);

        // 4. Check if ANY preference is set
        boolean hasCuisine = preferredCuisines != null && !preferredCuisines.isEmpty();
        boolean hasDiet = !dietaryTags.isEmpty();
        boolean hasAllergen = excludeAllergen != null;

        if (hasCuisine || hasDiet || hasAllergen) {
            // Pass the SET of cuisines
            return recipeRepository.findRecipesByFilters(preferredCuisines, dietaryTags, excludeAllergen);
        }

        return Collections.emptyList();
    }

}
