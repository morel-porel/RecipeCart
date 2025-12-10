package com.palepo.recipecart.service;

import com.palepo.recipecart.OrderStatus;
import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.entity.Order;
import com.palepo.recipecart.entity.Payment;
import com.palepo.recipecart.exception.OrderNotFoundException;
import com.palepo.recipecart.repository.IngredientRepository;
import com.palepo.recipecart.repository.OrderRepository;
import com.palepo.recipecart.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CashierService {

    private final OrderRepository orderRepository;
    private final IngredientRepository ingredientRepository;
    private final PaymentRepository paymentRepository;

    public CashierService(OrderRepository orderRepository,
                          IngredientRepository ingredientRepository,
                          PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.ingredientRepository = ingredientRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Get all pending orders (PROCESSING status)
     */
    public List<Order> getPendingOrders() {
        return orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == OrderStatus.PROCESSING)
                .toList();
    }

    /**
     * Get all orders with a specific status
     */
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == status)
                .toList();
    }

    /**
     * Update order status
     */
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        // If marking as READY_FOR_PICKUP or COMPLETED, ensure payment is processed
        if ((newStatus == OrderStatus.READY_FOR_PICKUP || newStatus == OrderStatus.COMPLETED)
                && order.getPayment() != null
                && order.getPayment().getStatus().equals("PENDING")) {

            Payment payment = order.getPayment();
            payment.setStatus("COMPLETED");
            payment.setPaymentTimestamp(LocalDateTime.now());
            paymentRepository.save(payment);
        }

        return orderRepository.save(order);
    }

    /**
     * Process payment for an order (for PAY_IN_STORE orders)
     */
    @Transactional
    public Payment processPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        Payment payment = order.getPayment();
        if (payment == null) {
            throw new IllegalStateException("No payment record found for this order");
        }

        if (payment.getStatus().equals("COMPLETED")) {
            throw new IllegalStateException("Payment already completed");
        }

        payment.setStatus("COMPLETED");
        payment.setPaymentTimestamp(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    /**
     * Get all ingredients
     */
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    /**
     * Update ingredient stock level
     */
    @Transactional
    public Ingredient updateStock(Long ingredientId, int newStockLevel) {
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new EntityNotFoundException("Ingredient not found with id: " + ingredientId));

        if (newStockLevel < 0) {
            throw new IllegalArgumentException("Stock level cannot be negative");
        }

        ingredient.setStockLevel(newStockLevel);
        return ingredientRepository.save(ingredient);
    }

    /**
     * Get order details (for cashier dashboard)
     */
    public Order getOrderDetails(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
    }

    /**
     * Get all orders
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * View dashboard statistics
     */
    public DashboardStats getDashboardStats() {
        List<Order> allOrders = orderRepository.findAll();

        long processingCount = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PROCESSING)
                .count();

        long readyCount = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.READY_FOR_PICKUP)
                .count();

        long completedCount = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .count();

        double totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .mapToDouble(Order::getTotalAmount)
                .sum();

        return new DashboardStats(processingCount, readyCount, completedCount, totalRevenue);
    }

    // Inner class for dashboard statistics
    public static class DashboardStats {
        private long processingOrders;
        private long readyForPickup;
        private long completedOrders;
        private double totalRevenue;

        public DashboardStats(long processingOrders, long readyForPickup, long completedOrders, double totalRevenue) {
            this.processingOrders = processingOrders;
            this.readyForPickup = readyForPickup;
            this.completedOrders = completedOrders;
            this.totalRevenue = totalRevenue;
        }

        public long getProcessingOrders() {
            return processingOrders;
        }

        public long getReadyForPickup() {
            return readyForPickup;
        }

        public long getCompletedOrders() {
            return completedOrders;
        }

        public double getTotalRevenue() {
            return totalRevenue;
        }
    }
}