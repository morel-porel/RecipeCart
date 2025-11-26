package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.Recipe;
import com.palepo.recipecart.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final RecipeService recipeService;

    public UserController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    // --- THIS IS YOUR NEW ENDPOINT ---
    @GetMapping("/{userId}/recommendations")
    public ResponseEntity<List<Recipe>> getPersonalizedRecommendations(@PathVariable Long userId) {
        List<Recipe> recommendations = recipeService.getRecommendationsForUser(userId);
        return ResponseEntity.ok(recommendations);
    }
}