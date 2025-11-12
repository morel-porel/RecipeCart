package com.palepo.recipecart.repository;

import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByDietaryTagsIn(Set<String> dietaryTags);
    List<Recipe> findByCuisineIgnoreCase(String cuisine);
    List<Recipe> findByCuisineIgnoreCaseAndDietaryTagsIn(String cuisine, Set<String> dietaryTags);
    /**
     * Finds all recipes that DO NOT contain the specified allergen in their allergenInfo set.
     * @param allergen The allergen to exclude (e.g., "NUT", "DAIRY").
     * @return A list of recipes safe from that allergen.
     */
    @Query("SELECT r FROM Recipe r WHERE :allergen NOT IN elements(r.allergenInfo)")
    List<Recipe> findAllByAllergenInfoNotContaining(@Param("allergen") String allergen);
}
