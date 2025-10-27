package com.palepo.recipecart.controller;

import com.palepo.recipecart.entity.User;
import com.palepo.recipecart.entity.UserProfile;
import com.palepo.recipecart.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<User> register(@RequestBody User newUser) {
        User savedUser = userService.registerUser(newUser);

        // Remove password before returning
        savedUser.setPassword(null);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // Update profile endpoint
    @PutMapping("/users/{userId}/profile")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Long userId, @RequestBody UserProfile userProfileData) {
        UserProfile updated = userService.updateUserProfile(userId, userProfileData);
        return ResponseEntity.ok(updated);
    }
}