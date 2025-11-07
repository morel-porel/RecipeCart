package com.palepo.recipecart.repository;

import com.palepo.recipecart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndIngredientId(Long cartId, Long ingredientId);
}