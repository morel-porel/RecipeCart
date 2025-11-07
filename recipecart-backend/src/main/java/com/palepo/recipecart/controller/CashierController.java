package com.palepo.recipecart.controller;

import com.palepo.recipecart.OrderStatus;
import com.palepo.recipecart.entity.Ingredient;
import com.palepo.recipecart.entity.Order;
import com.palepo.recipecart.entity.Payment;
import com.palepo.recipecart.service.CashierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cashier")
@CrossOrigin(origins = "http://localhost:5173")
public class CashierController {

    private final CashierService cashierService;

    public CashierController(CashierService cashierService) {
        this.cashierService = cashierService;
    }

    /**
     * Get dashboard statistics
     * GET /api/cashier/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<CashierService.DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(cashierService.getDashboardStats());
    }

    /**
     * Get all pending orders
     * GET /api/cashier/orders/pending
     */
    @GetMapping("/orders/pending")
    public ResponseEntity<List<Order>> getPendingOrders() {
        List<Order> orders = cashierService.getPendingOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * Get orders by status
     * GET /api/cashier/orders?status=PROCESSING
     */
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrdersByStatus(@RequestParam OrderStatus status) {
        List<Order> orders = cashierService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get all orders
     * GET /api/cashier/orders/all
     */
    @GetMapping("/orders/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = cashierService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * Get specific order details
     * GET /api/cashier/orders/{orderId}
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Order> getOrderDetails(@PathVariable Long orderId) {
        Order order = cashierService.getOrderDetails(orderId);
        return ResponseEntity.ok(order);
    }

    /**
     * Update order status
     * PUT /api/cashier/orders/{orderId}/status
     * Body: { "status": "READY_FOR_PICKUP" }
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {
        
        OrderStatus newStatus = OrderStatus.valueOf(request.get("status"));
        Order updatedOrder = cashierService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * Process payment for an order (for PAY_IN_STORE orders)
     * POST /api/cashier/orders/{orderId}/payment
     */
    @PostMapping("/orders/{orderId}/payment")
    public ResponseEntity<Payment> processPayment(@PathVariable Long orderId) {
        Payment payment = cashierService.processPayment(orderId);
        return ResponseEntity.ok(payment);
    }

    /**
     * Update ingredient stock
     * PUT /api/cashier/ingredients/{ingredientId}/stock
     * Body: { "stockLevel": 100 }
     */
    @PutMapping("/ingredients/{ingredientId}/stock")
    public ResponseEntity<Ingredient> updateStock(
            @PathVariable Long ingredientId,
            @RequestBody Map<String, Integer> request) {
        
        Integer newStockLevel = request.get("stockLevel");
        Ingredient updatedIngredient = cashierService.updateStock(ingredientId, newStockLevel);
        return ResponseEntity.ok(updatedIngredient);
    }
}