package com.palepo.recipecart.service;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.repository.IngredientRepository;
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
}
