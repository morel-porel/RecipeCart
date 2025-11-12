package com.palepo.recipecart.service;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.repository.IngredientRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientService {
    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository){
        this.ingredientRepository = ingredientRepository;
    }

    public Ingredient createIngredient(Ingredient ingredient){
        return ingredientRepository.save(ingredient);
    }
    public List<Ingredient> getAllIngredients(){
        return ingredientRepository.findAll();
    }
    public Ingredient updateIngredient(Long id, Ingredient ingredientDetails) {
        // First, find the existing ingredient
        Ingredient existingIngredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ingredient not found with ID: " + id));

        // Now, update its fields with the new details
        existingIngredient.setName(ingredientDetails.getName());
        existingIngredient.setStockLevel(ingredientDetails.getStockLevel());
        existingIngredient.setUnit(ingredientDetails.getUnit());
        existingIngredient.setPrice(ingredientDetails.getPrice());

        // Save the updated ingredient back to the database
        return ingredientRepository.save(existingIngredient);
    }
}
