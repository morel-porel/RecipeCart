package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.service.IngredientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService){
        this.ingredientService = ingredientService;
    }

    @PostMapping("/ingredients")
    public Ingredient createIngredient(@RequestBody Ingredient ingredient){
        return ingredientService.createIngredient(ingredient);
    }

    @GetMapping("/ingredients")
    public List<Ingredient> getIngredients(@PathVariable Long userId){
        return ingredientService.getAllIngredients();
    }



}
