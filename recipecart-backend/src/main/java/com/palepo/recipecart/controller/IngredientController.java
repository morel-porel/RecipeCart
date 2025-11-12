package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.service.IngredientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin(origins = "http://localhost:5173")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService){
        this.ingredientService = ingredientService;
    }

    @PostMapping
    public Ingredient createIngredient(@RequestBody Ingredient ingredient){
        return ingredientService.createIngredient(ingredient);
    }

    @GetMapping
    public List<Ingredient> getAllIngredients(){
        return ingredientService.getAllIngredients();
    }

    // PUT /api/ingredients/{id} -> Updates an existing ingredient
    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable Long id, @RequestBody Ingredient ingredientDetails) {
        Ingredient updatedIngredient = ingredientService.updateIngredient(id, ingredientDetails);
        return ResponseEntity.ok(updatedIngredient);
    }
}
