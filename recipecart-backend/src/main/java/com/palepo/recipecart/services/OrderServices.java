package com.palepo.recipecart.service;

import com.palepo.recipecart.entity.*;
import com.palepo.recipecart.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(UserRepository userRepository,
                        RecipeIngredientRepository recipeIngredientRepository,
                        OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository) {
        this.userRepository = userRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public Order createOrder(Order orderRequest) {
        // Step 1: Verify the user exists
        User user = userRepository.findById(orderRequest.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        double totalPrice = 0.0;

        // Step 2: Process each OrderItem
        for (OrderItem orderItem : orderRequest.getOrderItems()) {
            RecipeIngredient ingredient = recipeIngredientRepository.findById(orderItem.getRecipeIngredient().getId())
                    .orElseThrow(() -> new EntityNotFoundException("RecipeIngredient not found"));

            int requestedQuantity = orderItem.getQuantity();

            // Check stock
            if (ingredient.getStockLevel() < requestedQuantity) {
                throw new IllegalArgumentException("Not enough stock for ingredient: " + ingredient.getName());
            }

            // Decrement stock
            ingredient.setStockLevel(ingredient.getStockLevel() - requestedQuantity);
            recipeIngredientRepository.save(ingredient);

            // Compute item price
            double itemTotal = ingredient.getPrice() * requestedQuantity;
            orderItem.setPrice(itemTotal);
            orderItem.setRecipeIngredient(ingredient);
            orderItem.setOrder(orderRequest);

            totalPrice += itemTotal;
        }

        // Step 3: Set totals and save order
        orderRequest.setUser(user);
        orderRequest.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(orderRequest);

        // Step 4: Save each OrderItem
        for (OrderItem orderItem : orderRequest.getOrderItems()) {
            orderItem.setOrder(savedOrder);
            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}