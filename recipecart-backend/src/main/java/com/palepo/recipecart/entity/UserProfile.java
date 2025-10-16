package com.palepo.recipecart.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private Long id;

    @OneToOne
    @MapsId // This links this entity's ID to the User's ID
    @JoinColumn(name = "user_id")
    private User user;

    @ElementCollection
    @CollectionTable(name = "user_allergies", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "allergy")
    private Set<String> allergies;

    @Column(name = "dietary_plan")
    private String dietaryPlan;

    @ElementCollection
    @CollectionTable(name = "user_cuisines", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "cuisine")
    private Set<String> favoriteCuisines;

    public UserProfile() {}

    public UserProfile(User user, Set<String> allergies, String dietaryPlan, Set<String> favoriteCuisines) {
        this.user = user;
        this.allergies = allergies;
        this.dietaryPlan = dietaryPlan;
        this.favoriteCuisines = favoriteCuisines;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(Set<String> allergies) {
        this.allergies = allergies;
    }

    public String getDietaryPlan() {
        return dietaryPlan;
    }

    public void setDietaryPlan(String dietaryPlan) {
        this.dietaryPlan = dietaryPlan;
    }

    public Set<String> getFavoriteCuisines() {
        return favoriteCuisines;
    }

    public void setFavoriteCuisines(Set<String> favoriteCuisines) {
        this.favoriteCuisines = favoriteCuisines;
    }

}