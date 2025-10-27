package com.palepo.recipecart.repository;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByName(String name);
    List<Recipe> findByNutritionFacts(String nutritionFacts);
    List<Recipe> findByDietaryTags(String dietaryTags);
    List<Recipe> findByAllergenInfo(String allergenInfo);
    List<Recipe> findByCuisine(String cuisine);
}
