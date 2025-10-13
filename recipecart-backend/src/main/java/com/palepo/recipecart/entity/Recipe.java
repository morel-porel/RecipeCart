package com.palepo.recipecart.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "nutrition_facts")
    private String nutritionFacts;

    public Recipe() {
    }

    public Recipe(String name, String instructions, String nutritionFacts) {
        this.name = name;
        this.instructions = instructions;
        this.nutritionFacts = nutritionFacts;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getNutritionFacts() {
        return nutritionFacts;
    }

    public void setNutritionFacts(String nutritionFacts) {
        this.nutritionFacts = nutritionFacts;
    }
}