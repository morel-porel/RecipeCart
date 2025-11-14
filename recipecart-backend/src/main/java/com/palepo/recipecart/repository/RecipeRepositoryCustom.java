package com.palepo.recipecart.repository;

import com.palepo.recipecart.entity.Recipe;
import java.util.Set;
import java.util.List;

public interface RecipeRepositoryCustom {
    List<Recipe> findRecipesByFilters(String cuisine, Set<String> dietaryTags, String excludeAllergen);
}