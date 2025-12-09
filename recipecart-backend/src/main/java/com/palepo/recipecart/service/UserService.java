package com.palepo.recipecart.service;

import com.palepo.recipecart.entity.User;
import com.palepo.recipecart.entity.UserProfile;
import com.palepo.recipecart.exception.UserAlreadyExistsException;
import com.palepo.recipecart.repository.UserProfileRepository;
import com.palepo.recipecart.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

/**
 * CHANGES MADE TO SUPPORT UNIFIED LOGIN FOR CASHIERS:
 * 1. Added default role assignment ("CUSTOMER") in registerUser() if no role provided
 * 2. Enhanced loginUser() method documentation to clarify it works for ALL user types
 * 3. No structural changes needed - existing code already supports multiple roles
 */

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User newUser) {
        // check existing username/email
        Optional<User> byUsername = userRepository.findByUsername(newUser.getUsername());
        if (byUsername.isPresent()) {
            throw new UserAlreadyExistsException("Username already taken");
        }
        Optional<User> byEmail = userRepository.findByEmail(newUser.getEmail());
        if (byEmail.isPresent()) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        // Hash password and set
        String rawPassword = newUser.getPassword();
        String hashed = passwordEncoder.encode(rawPassword);
        newUser.setPassword(hashed);

        // CHANGE: Set default role if not provided (supports creating users with any role)
        if (newUser.getRole() == null || newUser.getRole().isEmpty()) {
            newUser.setRole("CUSTOMER");
        }

        // Ensure UserProfile exists and is linked
        UserProfile profile = newUser.getUserProfile();
        if (profile == null) {
            profile = new UserProfile();
        }
        profile.setUser(newUser);
        newUser.setUserProfile(profile);

        // Save user (profile cascades due to CascadeType.ALL on the relation)
        User saved = userRepository.save(newUser);
        return saved;
    }

    /**
     * CHANGE: Enhanced documentation to clarify this method works for ALL user roles
     * Login user - works for CUSTOMER, CASHIER, and ADMIN users
     * Accepts either email or username as login identifier
     * Returns the full User object including role information for frontend routing
     */
    public User loginUser(String emailOrUsername, String password) {
        // Try to find user by email first
        Optional<User> userByEmail = userRepository.findByEmail(emailOrUsername);

        // If not found by email, try username
        Optional<User> userByUsername = userRepository.findByUsername(emailOrUsername);

        User user = userByEmail.orElse(userByUsername.orElse(null));

        if (user == null) {
            throw new EntityNotFoundException("User not found");
        }

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    /**
     * Get user profile
     */
    @Transactional
    public UserProfile getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        UserProfile profile = user.getUserProfile();

        if (profile == null) {
            // Create empty profile if it doesn't exist
            profile = new UserProfile();
            profile.setUser(user);
            profile = userProfileRepository.save(profile);
            user.setUserProfile(profile);
            userRepository.save(user);
        }

        // Force initialization of lazy collections
        if (profile.getAllergies() != null) {
            profile.getAllergies().size();
        }
        if (profile.getFavoriteCuisines() != null) {
            profile.getFavoriteCuisines().size();
        }

        return profile;
    }

    @Transactional
    public UserProfile updateUserProfile(Long userId, UserProfile userProfileData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        UserProfile existing = user.getUserProfile();
        if (existing == null) {
            existing = new UserProfile();
            existing.setUser(user);
        }

        // Copy fields from incoming profile object
        existing.setAllergies(userProfileData.getAllergies());
        existing.setDietaryPlan(userProfileData.getDietaryPlan());
        existing.setFavoriteCuisines(userProfileData.getFavoriteCuisines());

        UserProfile saved = userProfileRepository.save(existing);

        // attach to user (if not already attached)
        user.setUserProfile(saved);
        userRepository.save(user);

        return saved;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        // Due to CascadeType.ALL, this will also delete:
        // - UserProfile
        // - ShoppingCart (and CartItems via orphanRemoval)
        // - Orders (and OrderItems via orphanRemoval)
        userRepository.delete(user);
    }
}