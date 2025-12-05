package com.palepo.recipecart.service;

import com.palepo.recipecart.OrderStatus;
import com.palepo.recipecart.PaymentType;
import com.palepo.recipecart.entity.*;
import com.palepo.recipecart.exception.*;
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
    private final ShoppingCartRepository cartRepository;
    private final PaymentRepository paymentRepository;

    public OrderService(UserRepository userRepository,
                        IngredientRepository ingredientRepository,
                        OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ShoppingCartRepository cartRepository,
                        PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.ingredientRepository = ingredientRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Create order from shopping cart
     */
    @Transactional
    public Order createOrderFromCart(Long userId, PaymentType paymentType) {
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Get user's cart
        ShoppingCart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException("Shopping cart not found for user"));

        // Check if cart is empty
        if (cart.getItems().isEmpty()) {
            throw new EmptyCartException("Cannot create order from empty cart");
        }

        double totalPrice = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        // Process each cart item
        for (CartItem cartItem : cart.getItems()) {
            Ingredient ingredient = cartItem.getIngredient();
            int requestedQuantity = cartItem.getQuantity();

            // Check stock
            if (ingredient.getStockLevel() < requestedQuantity) {
                throw new InsufficientStockException(
                    "Not enough stock for ingredient: " + ingredient.getName() +
                    ". Available: " + ingredient.getStockLevel() +
                    ", Requested: " + requestedQuantity
                );
            }

            // Decrement stock
            ingredient.setStockLevel(ingredient.getStockLevel() - requestedQuantity);
            ingredientRepository.save(ingredient);

            // Compute item price
            double itemTotal = ingredient.getPrice() * requestedQuantity;

            OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(requestedQuantity);
            orderItem.setPriceAtPurchase(itemTotal);
            // Preserve recipe source from cart item if available
            orderItem.setRecipeSource(cartItem.getRecipeSource());
            orderItem.setIngredient(ingredient);
            orderItems.add(orderItem);

            totalPrice += itemTotal;
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalPrice);
        order.setStatus(OrderStatus.PROCESSING);
        order.setPaymentType(paymentType);
        order.setOrderItems(orderItems);

        // Link order items to order
        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(order);
        }

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Create payment record
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(totalPrice);
        
        if (paymentType == PaymentType.PAID_ONLINE) {
            // Simulate payment processing
            payment.setStatus("COMPLETED");
            payment.setPaymentTimestamp(LocalDateTime.now());
        } else {
            payment.setStatus("PENDING");
            payment.setPaymentTimestamp(null);
        }
        
        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        // Clear the cart after successful order
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    /**
     * Legacy method - create order directly (without cart)
     */
    @Transactional
    public Order createOrder(Order orderRequest) {
        // Verify the user exists
        User user = userRepository.findById(orderRequest.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        double totalPrice = 0.0;
        List<OrderItem> managedOrderItems = new ArrayList<>();

        // Process each OrderItem
        for (OrderItem orderItem : orderRequest.getOrderItems()) {
            Ingredient ingredient = ingredientRepository.findById(orderItem.getIngredient().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Ingredient not found"));

            int requestedQuantity = orderItem.getQuantity();

            // Check stock
            if (ingredient.getStockLevel() < requestedQuantity) {
                throw new InsufficientStockException(
                    "Not enough stock for ingredient: " + ingredient.getName()
                );
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

        // Create order
        Order savedOrder = new Order();
        savedOrder.setUser(user);
        savedOrder.setOrderDate(LocalDateTime.now());
        savedOrder.setTotalAmount(totalPrice);
        savedOrder.setStatus(OrderStatus.PROCESSING);
        savedOrder.setPaymentType(orderRequest.getPaymentType());
        savedOrder.setOrderItems(managedOrderItems);

        // Link order items to order
        for (OrderItem orderItem : managedOrderItems) {
            orderItem.setOrder(savedOrder);
        }

        Order finalOrder = orderRepository.save(savedOrder);

        // Create payment record
        Payment payment = new Payment();
        payment.setOrder(finalOrder);
        payment.setAmount(totalPrice);
        
        if (orderRequest.getPaymentType() == PaymentType.PAID_ONLINE) {
            payment.setStatus("COMPLETED");
            payment.setPaymentTimestamp(LocalDateTime.now());
        } else {
            payment.setStatus("PENDING");
        }
        
        paymentRepository.save(payment);

        return finalOrder;
    }

    /**
     * Get order history for a user - FIX: Explicitly fetch all lazy relationships
     */
    @Transactional
    public List<Order> getOrderHistory(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        
        // Force initialization of lazy-loaded relationships
        for (Order order : orders) {
            // Initialize orderItems collection
            if (order.getOrderItems() != null) {
                order.getOrderItems().size();
                
                // Initialize ingredient for each order item
                for (OrderItem item : order.getOrderItems()) {
                    if (item.getIngredient() != null) {
                        item.getIngredient().getName(); // Touch the ingredient to load it
                    }
                }
            }
        }
        
        return orders;
    }

    /**
     * Get a specific order by ID - FIX: Explicitly fetch all lazy relationships
     */
    @Transactional
    public Order getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        
        // Force initialization of lazy-loaded relationships
        order.getOrderItems().size();
        for (OrderItem item : order.getOrderItems()) {
            item.getIngredient().getName();
        }
        
        return order;
    }

    /**
     * Cancel an order (only if it's still PROCESSING)
     */
    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = getOrderById(orderId);

        // Verify order belongs to user
        if (!order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Order does not belong to this user");
        }

        // Can only cancel if processing
        if (order.getStatus() != OrderStatus.PROCESSING) {
            throw new IllegalStateException("Can only cancel orders that are still processing");
        }

        // Restore stock for all items
        for (OrderItem item : order.getOrderItems()) {
            Ingredient ingredient = item.getIngredient();
            ingredient.setStockLevel(ingredient.getStockLevel() + item.getQuantity());
            ingredientRepository.save(ingredient);
        }

        // Update order status
        order.setStatus(OrderStatus.CANCELED);
        
        // Update payment status if exists
        if (order.getPayment() != null) {
            order.getPayment().setStatus("REFUNDED");
            paymentRepository.save(order.getPayment());
        }

        return orderRepository.save(order);
    }
}