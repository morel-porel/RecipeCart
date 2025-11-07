package com.palepo.recipecart.controller;

import com.palepo.recipecart.PaymentType;
import com.palepo.recipecart.entity.Order;
import com.palepo.recipecart.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Create order from shopping cart (NEW - Recommended)
     * POST /api/orders/checkout
     * Body: { "userId": 1, "paymentType": "PAID_ONLINE" or "PAY_IN_STORE" }
     */
    @PostMapping("/orders/checkout")
    public ResponseEntity<Order> checkoutFromCart(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        PaymentType paymentType = PaymentType.valueOf(request.get("paymentType").toString());
        
        Order order = orderService.createOrderFromCart(userId, paymentType);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    /**
     * Create order directly (Legacy - for backward compatibility)
     * POST /api/orders
     */
    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    /**
     * Get user's order history
     * GET /api/users/{userId}/orders
     */
    @GetMapping("/users/{userId}/orders")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrderHistory(userId);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get specific order details
     * GET /api/orders/{orderId}
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    /**
     * Cancel an order
     * PUT /api/orders/{orderId}/cancel
     * Body: { "userId": 1 }
     */
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, Long> request) {
        
        Long userId = request.get("userId");
        Order canceledOrder = orderService.cancelOrder(orderId, userId);
        return ResponseEntity.ok(canceledOrder);
    }
}