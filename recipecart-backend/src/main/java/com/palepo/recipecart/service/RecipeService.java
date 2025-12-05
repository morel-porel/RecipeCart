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

        boolean hasName = name != null && !name.trim().isEmpty();
        if (hasName) {
            return recipeRepository.findByNameContainingIgnoreCase(name);
        }

        boolean hasAnyFilter = (cuisine != null && !cuisine.trim().isEmpty()) ||
                (dietaryTags != null && !dietaryTags.isEmpty()) ||
                (excludeAllergen != null && !excludeAllergen.trim().isEmpty());

        if (hasAnyFilter) {
            return recipeRepository.findRecipesByFilters(cuisine, dietaryTags, excludeAllergen);
        } else {
            return recipeRepository.findAll();
        }
    }

    @Transactional
    public Recipe updateRecipe(Long id, Recipe recipeDetails) {
        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found with ID: " + id));

        existingRecipe.setName(recipeDetails.getName());
        existingRecipe.setInstructions(recipeDetails.getInstructions());
        existingRecipe.setNutritionFacts(recipeDetails.getNutritionFacts());
        existingRecipe.setCuisine(recipeDetails.getCuisine());

        existingRecipe.getDietaryTags().clear();
        existingRecipe.getDietaryTags().addAll(recipeDetails.getDietaryTags());

        existingRecipe.getAllergenInfo().clear();
        existingRecipe.getAllergenInfo().addAll(recipeDetails.getAllergenInfo());

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

        String preferredCuisine = profile.getFavoriteCuisines().stream().findFirst().orElse(null);
        String dietaryPlan = profile.getDietaryPlan();
        String excludeAllergen = profile.getAllergies().stream().findFirst().orElse(null);

        if (preferredCuisine != null) {
            return recipeRepository.findRecipesByFilters(preferredCuisine, Set.of(dietaryPlan), excludeAllergen);
        }

        return Collections.emptyList();
    }

}
