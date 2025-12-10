package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.User;
import com.palepo.recipecart.entity.UserProfile;
import com.palepo.recipecart.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Register endpoint
    @PostMapping("/auth/register")
    public ResponseEntity<UserRegistrationResponse> register(@RequestBody User newUser) {
        User savedUser = userService.registerUser(newUser);

        UserRegistrationResponse response = new UserRegistrationResponse(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getRole()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Update basic user info endpoint (NEW)
    @PutMapping("/users/{userId}")
    public ResponseEntity<UserRegistrationResponse> updateUser(
            @PathVariable Long userId, 
            @RequestBody Map<String, String> updates) {
        
        User updatedUser = userService.updateUserBasicInfo(userId, updates);
        
        UserRegistrationResponse response = new UserRegistrationResponse(
            updatedUser.getId(),
            updatedUser.getUsername(),
            updatedUser.getEmail(),
            updatedUser.getRole()
        );
        
        return ResponseEntity.ok(response);
    }

    // Update profile endpoint
    @PutMapping("/users/{userId}/profile")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Long userId, @RequestBody UserProfile userProfileData) {
        UserProfile updated = userService.updateUserProfile(userId, userProfileData);
        return ResponseEntity.ok(updated);
    }

    // Delete user endpoint
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Login endpoint
    @PostMapping("/auth/login")
    public ResponseEntity<UserRegistrationResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getEmailOrUsername(), loginRequest.getPassword());
        
        UserRegistrationResponse response = new UserRegistrationResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
        
        return ResponseEntity.ok(response);
    }

    // Get user by ID
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserRegistrationResponse> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        
        UserRegistrationResponse response = new UserRegistrationResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
        
        return ResponseEntity.ok(response);
    }

    // Login request DTO
    public static class LoginRequest {
        private String emailOrUsername;
        private String password;

        public String getEmailOrUsername() {
            return emailOrUsername;
        }

        public void setEmailOrUsername(String emailOrUsername) {
            this.emailOrUsername = emailOrUsername;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Response DTO
    public static class UserRegistrationResponse {
        private Long id;
        private String username;
        private String email;
        private String role;

        public UserRegistrationResponse(Long id, String username, String email, String role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}