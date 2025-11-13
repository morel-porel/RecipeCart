-- ===============================================================================================
-- RECIPECART FINAL DATABASE SCRIPT
-- This script populates the database with a wide variety of ingredients and recipes.
-- It is idempotent, meaning it can be run multiple times without causing errors.
-- ===============================================================================================

-- ===============================================================================================
-- SECTION 1: MASTER INGREDIENT LIST
-- All ingredients are defined here with an ID, name, stock level, unit, and price.
-- ===============================================================================================
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (101, 'Tomato', 100, 'pcs', 0.50) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (102, 'Spaghetti Pasta', 5000, 'g', 0.01) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (103, 'Onion', 75, 'pcs', 0.25) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (104, 'Garlic', 200, 'cloves', 0.10) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (105, 'Chicken Breast', 50, 'pcs', 3.50) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (106, 'Olive Oil', 10000, 'ml', 0.02) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (107, 'Salt', 5000, 'g', 0.01) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (108, 'Black Pepper', 1000, 'g', 0.05) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (109, 'Egg', 150, 'pcs', 0.30) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (110, 'Pancetta', 1000, 'g', 0.15) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (111, 'Parmesan Cheese', 2000, 'g', 0.20) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (112, 'Chicken Thigh', 50, 'pcs', 2.50) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (113, 'Soy Sauce', 5000, 'ml', 0.03) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (114, 'White Vinegar', 5000, 'ml', 0.02) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (115, 'Bay Leaf', 500, 'pcs', 0.05) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (116, 'Ground Beef', 10000, 'g', 0.02) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (117, 'Taco Shells', 200, 'pcs', 0.40) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (118, 'Cheddar Cheese', 2000, 'g', 0.18) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (119, 'Lettuce', 50, 'heads', 1.50) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (120, 'Tofu', 100, 'blocks', 2.00) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (121, 'Bell Pepper', 80, 'pcs', 0.80) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (122, 'Broccoli', 60, 'heads', 1.80) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (123, 'Shrimp', 5000, 'g', 0.25) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (124, 'Peanuts', 2000, 'g', 0.10) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (125, 'Thai Basil', 500, 'bunches', 1.20) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (126, 'Rice Noodles', 5000, 'g', 0.02) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (127, 'Fish Sauce', 3000, 'ml', 0.04) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (128, 'Lime', 100, 'pcs', 0.35) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (129, 'Yogurt', 2000, 'g', 0.05) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (130, 'Garam Masala', 1000, 'g', 0.15) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (131, 'Turmeric', 1000, 'g', 0.12) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (132, 'Canned Tomatoes', 300, 'cans', 1.10) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (133, 'Salmon Fillet', 40, 'pcs', 7.50) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (134, 'Miso Paste', 1000, 'g', 0.10) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (135, 'Pizza Dough', 50, 'pcs', 2.50) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (136, 'Mozzarella Cheese', 2000, 'g', 0.22) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (137, 'Fresh Basil', 100, 'bunches', 1.00) ON DUPLICATE KEY UPDATE name=name;

-- ===============================================================================================
-- SECTION 2: RECIPES
-- All recipes are defined here with a unique ID and core information.
-- ===============================================================================================

-- Italian Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (1, 'Spaghetti Carbonara', '1. Cook pasta. 2. Fry pancetta. 3. Whisk eggs and cheese. 4. Combine everything quickly.', 'Calories: 650, Protein: 30g, Fat: 35g', 'ITALIAN') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (2, 'Margherita Pizza', '1. Roll out dough. 2. Spread tomato sauce. 3. Top with mozzarella and basil. 4. Bake until golden.', 'Calories: 800, Protein: 35g, Fat: 30g', 'ITALIAN') ON DUPLICATE KEY UPDATE name=name;

-- Filipino Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (3, 'Chicken Adobo', '1. Marinate chicken in soy sauce, vinegar, and garlic. 2. Simmer until tender. 3. Pan-fry for color.', 'Calories: 550, Protein: 40g, Fat: 30g', 'FILIPINO') ON DUPLICATE KEY UPDATE name=name;

-- Mexican Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (4, 'Classic Beef Tacos', '1. Brown ground beef with spices. 2. Warm taco shells. 3. Assemble tacos with lettuce, cheese, and tomatoes.', 'Calories: 450, Protein: 25g, Fat: 25g', 'MEXICAN') ON DUPLICATE KEY UPDATE name=name;

-- Chinese Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (5, 'Tofu Stir Fry', '1. Press and cube tofu. 2. Stir-fry with broccoli and bell peppers. 3. Add soy sauce mixture and simmer.', 'Calories: 400, Protein: 20g, Fat: 20g', 'CHINESE') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (6, 'Kung Pao Shrimp', '1. Marinate shrimp. 2. Stir-fry shrimp until pink. 3. Add peanuts, vegetables, and Kung Pao sauce.', 'Calories: 500, Protein: 30g, Fat: 28g', 'CHINESE') ON DUPLICATE KEY UPDATE name=name;

-- Thai Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (7, 'Pad Thai', '1. Soak rice noodles. 2. Stir-fry tofu/shrimp. 3. Add noodles, bean sprouts, and Pad Thai sauce. 4. Top with crushed peanuts.', 'Calories: 700, Protein: 25g, Fat: 30g', 'THAI') ON DUPLICATE KEY UPDATE name=name;

-- Indian Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (8, 'Chicken Tikka Masala', '1. Marinate chicken in yogurt and spices. 2. Grill or bake chicken. 3. Simmer in a creamy tomato sauce.', 'Calories: 600, Protein: 45g, Fat: 35g', 'INDIAN') ON DUPLICATE KEY UPDATE name=name;

-- Japanese Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (9, 'Teriyaki Salmon', '1. Pan-sear salmon fillets. 2. Glaze with teriyaki sauce (soy sauce, mirin, sugar). 3. Serve over rice.', 'Calories: 580, Protein: 40g, Fat: 30g', 'JAPANESE') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (10, 'Simple Miso Soup', '1. Bring dashi to a simmer. 2. Whisk in miso paste. 3. Add tofu cubes and seaweed.', 'Calories: 80, Protein: 6g, Fat: 3g', 'JAPANESE') ON DUPLICATE KEY UPDATE name=name;


-- ===============================================================================================
-- SECTION 3: DIETARY TAGS (recipe_dietary_tags)
-- Links recipes to their dietary classifications (Vegan, Keto, etc.).
-- ===============================================================================================
INSERT INTO recipe_dietary_tags (recipe_id, tag) VALUES (2, 'VEGETARIAN') ON DUPLICATE KEY UPDATE tag=tag;
INSERT INTO recipe_dietary_tags (recipe_id, tag) VALUES (5, 'VEGAN') ON DUPLICATE KEY UPDATE tag=tag;
INSERT INTO recipe_dietary_tags (recipe_id, tag) VALUES (5, 'VEGETARIAN') ON DUPLICATE KEY UPDATE tag=tag;
INSERT INTO recipe_dietary_tags (recipe_id, tag) VALUES (9, 'PESCATARIAN') ON DUPLICATE KEY UPDATE tag=tag;
INSERT INTO recipe_dietary_tags (recipe_id, tag) VALUES (10, 'VEGAN') ON DUPLICATE KEY UPDATE tag=tag;
INSERT INTO recipe_dietary_tags (recipe_id, tag) VALUES (10, 'VEGETARIAN') ON DUPLICATE KEY UPDATE tag=tag;
INSERT INTO recipe_dietary_tags (recipe_id, tag) VALUES (10, 'LOW_CARB') ON DUPLICATE KEY UPDATE tag=tag;

-- ===============================================================================================
-- SECTION 4: ALLERGENS (recipe_allergens)
-- Links recipes to the allergens they contain. Used for exclusion filtering.
-- ===============================================================================================
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (1, 'GLUTEN') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (1, 'DAIRY') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (1, 'EGG') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (2, 'GLUTEN') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (2, 'DAIRY') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (3, 'SOY') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (4, 'GLUTEN') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (4, 'DAIRY') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (5, 'SOY') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (6, 'SHELLFISH') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (6, 'NUT') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (7, 'SHELLFISH') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (7, 'NUT') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (7, 'EGG') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (8, 'DAIRY') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (9, 'SOY') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (10, 'SOY') ON DUPLICATE KEY UPDATE allergen=allergen;


-- ===============================================================================================
-- SECTION 5: RECIPE INGREDIENTS (recipe_ingredients)
-- The most critical part: links each recipe to its required ingredients with quantities.
-- ===============================================================================================

-- Spaghetti Carbonara (Recipe ID: 1)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (1, 102, 200, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Pasta
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (1, 110, 100, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Pancetta
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (1, 109, 2, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Egg
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (1, 111, 50, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Parmesan
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (1, 108, 5, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Black Pepper

-- Margherita Pizza (Recipe ID: 2)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (2, 135, 1, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Pizza Dough
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (2, 132, 0.5, 'cans') ON DUPLICATE KEY UPDATE quantity=quantity; -- Canned Tomatoes
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (2, 136, 150, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Mozzarella
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (2, 137, 0.5, 'bunches') ON DUPLICATE KEY UPDATE quantity=quantity; -- Fresh Basil
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (2, 106, 15, 'ml') ON DUPLICATE KEY UPDATE quantity=quantity; -- Olive Oil

-- Chicken Adobo (Recipe ID: 3)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (3, 112, 4, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Chicken Thigh
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (3, 113, 120, 'ml') ON DUPLICATE KEY UPDATE quantity=quantity; -- Soy Sauce
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (3, 114, 80, 'ml') ON DUPLICATE KEY UPDATE quantity=quantity; -- White Vinegar
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (3, 104, 5, 'cloves') ON DUPLICATE KEY UPDATE quantity=quantity; -- Garlic
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (3, 115, 3, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Bay Leaf
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (3, 108, 5, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Black Pepper

-- Classic Beef Tacos (Recipe ID: 4)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (4, 116, 500, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Ground Beef
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (4, 117, 8, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Taco Shells
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (4, 103, 1, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Onion
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (4, 119, 0.5, 'heads') ON DUPLICATE KEY UPDATE quantity=quantity; -- Lettuce
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (4, 101, 2, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Tomato
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (4, 118, 100, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Cheddar Cheese

-- Tofu Stir Fry (Recipe ID: 5)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (5, 120, 1, 'blocks') ON DUPLICATE KEY UPDATE quantity=quantity; -- Tofu
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (5, 122, 1, 'heads') ON DUPLICATE KEY UPDATE quantity=quantity; -- Broccoli
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (5, 121, 1, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Bell Pepper
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (5, 113, 60, 'ml') ON DUPLICATE KEY UPDATE quantity=quantity; -- Soy Sauce
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (5, 104, 3, 'cloves') ON DUPLICATE KEY UPDATE quantity=quantity; -- Garlic

-- Kung Pao Shrimp (Recipe ID: 6)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (6, 123, 400, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Shrimp
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (6, 124, 50, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Peanuts
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (6, 121, 1, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Bell Pepper
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (6, 113, 45, 'ml') ON DUPLICATE KEY UPDATE quantity=quantity; -- Soy Sauce

-- Pad Thai (Recipe ID: 7)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (7, 126, 200, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Rice Noodles
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (7, 123, 250, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Shrimp
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (7, 109, 2, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Egg
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (7, 127, 45, 'ml') ON DUPLICATE KEY UPDATE quantity=quantity; -- Fish Sauce
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (7, 128, 1, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Lime
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (7, 124, 30, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Peanuts

-- Chicken Tikka Masala (Recipe ID: 8)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (8, 105, 3, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Chicken Breast
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (8, 129, 200, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Yogurt
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (8, 132, 1, 'cans') ON DUPLICATE KEY UPDATE quantity=quantity; -- Canned Tomatoes
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (8, 103, 1, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Onion
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (8, 130, 15, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Garam Masala
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (8, 131, 10, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Turmeric

-- Teriyaki Salmon (Recipe ID: 9)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (9, 133, 2, 'pcs') ON DUPLICATE KEY UPDATE quantity=quantity; -- Salmon Fillet
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (9, 113, 80, 'ml') ON DUPLICATE KEY UPDATE quantity=quantity; -- Soy Sauce

-- Simple Miso Soup (Recipe ID: 10)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (10, 134, 30, 'g') ON DUPLICATE KEY UPDATE quantity=quantity; -- Miso Paste
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (10, 120, 0.5, 'blocks') ON DUPLICATE KEY UPDATE quantity=quantity; -- Tofu