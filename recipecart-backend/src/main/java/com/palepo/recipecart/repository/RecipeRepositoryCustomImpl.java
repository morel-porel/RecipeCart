package com.palepo.recipecart.repository;

import com.palepo.recipecart.entity.Recipe;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class RecipeRepositoryCustomImpl implements RecipeRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Recipe> findRecipesByFilters(Set<String> cuisines, Set<String> dietaryTags, String excludeAllergen) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Recipe> query = cb.createQuery(Recipe.class);
        Root<Recipe> recipe = query.from(Recipe.class);

        // A list to hold all our filter conditions (predicates)
        List<Predicate> predicates = new ArrayList<>();

        // 1. Add CUISINE filter if provided
        if (cuisines != null && !cuisines.isEmpty()) {
            List<Predicate> cuisineOptions  = new ArrayList<>();
            for (String c : cuisines) {
                if (c != null && !c.trim().isEmpty()) {
                    cuisineOptions.add(cb.equal(cb.lower(recipe.get("cuisine")), c.trim().toLowerCase()));
                }
            }
            if (!cuisineOptions.isEmpty()) {
                predicates.add(cb.or(cuisineOptions.toArray(new Predicate[0])));
            }

        }

        // 2. Add DIETARY TAGS filter if provided
        if (dietaryTags != null && !dietaryTags.isEmpty()) {
            // This creates a predicate for each tag and ORs them together if needed,
            for (String tag : dietaryTags) {
                if (tag != null && !tag.isEmpty()) {
                    predicates.add(cb.isMember(tag, recipe.get("dietaryTags")));
                }
            }
        }

        // 3. Add ALLERGEN EXCLUSION filter if provided
        if (excludeAllergen != null && !excludeAllergen.trim().isEmpty()) {
            predicates.add(cb.isNotMember(excludeAllergen, recipe.get("allergenInfo")));
        }

        // Combine all predicates with AND
        query.where(cb.and(predicates.toArray(new Predicate[0])));

        // Ensure we don't get duplicate recipes
        query.distinct(true);

        return entityManager.createQuery(query).getResultList();
    }
}