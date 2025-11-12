package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.Recipe;
import com.palepo.recipecart.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService){
        this.recipeService = recipeService;
    }

    @GetMapping
    public List<Recipe> searchOrGetAllRecipes(
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Set<String> dietaryTags,
            @RequestParam(required = false) String excludeAllergen) {
        return recipeService.searchRecipes(cuisine, dietaryTags, excludeAllergen);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        Recipe recipe = recipeService.getRecipeById(id);
        return ResponseEntity.ok(recipe);
    }

    @PostMapping
    public Recipe createRecipe(@RequestBody Recipe recipe) {
        return recipeService.createRecipe(recipe);
    }
}
