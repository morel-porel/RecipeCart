package com.palepo.recipecart.service;

import com.palepo.recipecart.OrderStatus;
import com.palepo.recipecart.entity.*;
import com.palepo.recipecart.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(UserRepository userRepository,
                        IngredientRepository ingredientRepository,
                        OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository) {
        this.userRepository = userRepository;
        this.ingredientRepository = ingredientRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public Order createOrder(Order orderRequest) {
        // Step 1: Verify the user exists
        User user = userRepository.findById(orderRequest.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        double totalPrice = 0.0;

        List<OrderItem> managedOrderItems = new ArrayList<>();

        // Step 2: Process each OrderItem
        for (OrderItem orderItem : orderRequest.getOrderItems()) {
            Ingredient ingredient = ingredientRepository.findById(orderItem.getIngredient().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Ingredient not found"));

            int requestedQuantity = orderItem.getQuantity();

            // Check stock
            if (ingredient.getStockLevel() < requestedQuantity) {
                throw new IllegalArgumentException("Not enough stock for ingredient: " + ingredient.getName());
            }

            // Decrement stock
            ingredient.setStockLevel(ingredient.getStockLevel() - requestedQuantity);
            ingredientRepository.save(ingredient);

            // Compute item price
            double itemTotal = ingredient.getPrice() * requestedQuantity;

            OrderItem newItem = new OrderItem();
            newItem.setQuantity(requestedQuantity);
            newItem.setPriceAtPurchase(itemTotal);
            newItem.setIngredient(ingredient);
            managedOrderItems.add(newItem);

            totalPrice += itemTotal;
        }

        // Step 3: Set totals and save order
        Order savedOrder = new Order();
        savedOrder.setUser(user);
        savedOrder.setOrderDate(LocalDateTime.now());
        savedOrder.setTotalAmount(totalPrice);
        savedOrder.setStatus(OrderStatus.PROCESSING);
        savedOrder.setPaymentType(orderRequest.getPaymentType());
        savedOrder.setOrderItems(managedOrderItems);

        // Step 4: Save each OrderItem
        for (OrderItem orderItem : managedOrderItems) {
            orderItem.setOrder(savedOrder);
        }

        return orderRepository.save(savedOrder);
    }

    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}