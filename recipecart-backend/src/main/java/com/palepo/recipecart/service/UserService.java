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

import java.util.Map;
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

        // Set default role if not provided
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

        User saved = userRepository.save(newUser);
        return saved;
    }

    /**
     * Update basic user information (username, email)
     */
    @Transactional
    public User updateUserBasicInfo(Long userId, Map<String, String> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        // Update username if provided and different
        if (updates.containsKey("username") && !updates.get("username").equals(user.getUsername())) {
            String newUsername = updates.get("username");
            // Check if username is already taken by another user
            Optional<User> existingUser = userRepository.findByUsername(newUsername);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                throw new UserAlreadyExistsException("Username already taken");
            }
            user.setUsername(newUsername);
        }

        // Update email if provided and different
        if (updates.containsKey("email") && !updates.get("email").equals(user.getEmail())) {
            String newEmail = updates.get("email");
            // Check if email is already taken by another user
            Optional<User> existingUser = userRepository.findByEmail(newEmail);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                throw new UserAlreadyExistsException("Email already registered");
            }
            user.setEmail(newEmail);
        }

        // Update password if provided (must be hashed)
        if (updates.containsKey("password") && updates.get("password") != null 
            && !updates.get("password").trim().isEmpty()) {
            String newPassword = updates.get("password");
            String hashedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(hashedPassword);
        }

        return userRepository.save(user);
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

        userRepository.delete(user);
    }
}