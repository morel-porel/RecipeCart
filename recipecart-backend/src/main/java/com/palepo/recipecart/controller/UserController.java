package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.Recipe;
import com.palepo.recipecart.entity.User;
import com.palepo.recipecart.entity.UserProfile;
import com.palepo.recipecart.service.RecipeService;
import com.palepo.recipecart.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final RecipeService recipeService;
    private final UserService userService;

    public UserController(RecipeService recipeService, UserService userService) {
        this.recipeService = recipeService;
        this.userService = userService;
    }

    /**
     * Get personalized recipe recommendations for a user
     * GET /api/users/{userId}/recommendations
     */
    @GetMapping("/{userId}/recommendations")
    public ResponseEntity<List<Recipe>> getPersonalizedRecommendations(@PathVariable Long userId) {
        List<Recipe> recommendations = recipeService.getRecommendationsForUser(userId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get user profile/preferences
     * GET /api/users/{userId}/profile
     */
    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Long userId) {
        UserProfile profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * Update user profile/preferences
     * PUT /api/users/{userId}/profile/preferences
     * Body: { "allergies": [...], "dietaryPlan": "...", "favoriteCuisines": [...] }
     */
    @PutMapping("/{userId}/profile/preferences")
    public ResponseEntity<UserProfile> updateUserProfile(
            @PathVariable Long userId, 
            @RequestBody UserProfile userProfileData) {
        UserProfile updated = userService.updateUserProfile(userId, userProfileData);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get user basic info (without sensitive data like password)
     * GET /api/users/{userId}
     */
    @GetMapping("/{userId}/basic-info")
    public ResponseEntity<UserBasicInfo> getUserBasicInfo(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        
        UserBasicInfo info = new UserBasicInfo(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
        
        return ResponseEntity.ok(info);
    }

    // DTO for user basic info (no password)
    public static class UserBasicInfo {
        private Long id;
        private String username;
        private String email;
        private String role;

        public UserBasicInfo(Long id, String username, String email, String role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}