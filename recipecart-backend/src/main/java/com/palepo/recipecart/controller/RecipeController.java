package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.Recipe;
import com.palepo.recipecart.service.RecipeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService){
        this.recipeService = recipeService;
    }

    @GetMapping("/recipes")
    public List<Recipe> getIngredients(@PathVariable Long userId){
        return recipeService.getAllRecipes();
    }
}
