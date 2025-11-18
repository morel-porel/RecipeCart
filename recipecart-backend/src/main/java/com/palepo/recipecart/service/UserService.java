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

        // Ensure UserProfile exists and is linked
        UserProfile profile = newUser.getUserProfile();
        if (profile == null) {
            profile = new UserProfile();
        }
        profile.setUser(newUser); // link both sides
        newUser.setUserProfile(profile);

        // Save user (profile cascades due to CascadeType.ALL on the relation)
        User saved = userRepository.save(newUser);
        return saved;
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