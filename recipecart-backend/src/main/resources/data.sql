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
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (1, 'Spaghetti Carbonara', 'Cook pasta...\nFry pancetta...\nCombine everything.', '{"calories": {"display": "650-700 kcal", "value": 650}, "carbohydrates": {"display": "60-65 g", "value": 62}, "protein": {"display": "28-32 g", "value": 30}, "fat": {"display": "35-40 g", "value": 38}}', 'ITALIAN', 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (2, 'Margherita Pizza', 'Roll out dough...\nTop with sauce, mozzarella, basil.\nBake until golden.', '{"calories": {"display": "750-800 kcal", "value": 780}, "carbohydrates": {"display": "90-95 g", "value": 92}, "protein": {"display": "35-40 g", "value": 38}, "fat": {"display": "30-35 g", "value": 32}}', 'ITALIAN', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500') ON DUPLICATE KEY UPDATE name=name;

-- Filipino Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (3, 'Chicken Adobo', 'Marinate chicken...\nSimmer until tender.\nPan-fry for color.', '{"calories": {"display": "500-550 kcal", "value": 520}, "carbohydrates": {"display": "10-15 g", "value": 12}, "protein": {"display": "40-45 g", "value": 42}, "fat": {"display": "30-35 g", "value": 33}}', 'FILIPINO', 'https://plus.unsplash.com/premium_photo-1664391929657-f901ee7f1414?q=80&w=1053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;

-- Mexican Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (4, 'Classic Beef Tacos', 'Brown ground beef...\nWarm shells.\nAssemble with toppings.', '{"calories": {"display": "450-500 kcal", "value": 470}, "carbohydrates": {"display": "25-30 g", "value": 28}, "protein": {"display": "25-30 g", "value": 27}, "fat": {"display": "25-30 g", "value": 26}}', 'MEXICAN', 'https://plus.unsplash.com/premium_photo-1664391890333-b6708e34b021?q=80&w=1029&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;

-- Chinese Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (5, 'Tofu Stir Fry', 'Press and cube tofu...\nStir-fry with vegetables.\nAdd sauce and simmer.', '{"calories": {"display": "350-400 kcal", "value": 380}, "carbohydrates": {"display": "20-25 g", "value": 22}, "protein": {"display": "20-25 g", "value": 21}, "fat": {"display": "20-25 g", "value": 23}}', 'CHINESE', 'https://images.unsplash.com/photo-1619683548293-c74defe8d5d2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (6, 'Kung Pao Shrimp', 'Marinate shrimp...\nStir-fry shrimp.\nAdd peanuts, vegetables, and sauce.', '{"calories": {"display": "480-520 kcal", "value": 500}, "carbohydrates": {"display": "15-20 g", "value": 18}, "protein": {"display": "30-35 g", "value": 32}, "fat": {"display": "28-32 g", "value": 30}}', 'CHINESE', 'https://images.unsplash.com/photo-1581073763302-e8e63f3e94e5?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;

-- Thai Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (7, 'Pad Thai', 'Soak noodles...\nStir-fry protein...\nAdd noodles and sauce. Top with peanuts.', '{"calories": {"display": "650-700 kcal", "value": 680}, "carbohydrates": {"display": "80-85 g", "value": 82}, "protein": {"display": "25-30 g", "value": 27}, "fat": {"display": "30-35 g", "value": 31}}', 'THAI', 'https://images.unsplash.com/photo-1655091273851-7bdc2e578a88?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;

-- Indian Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (8, 'Chicken Tikka Masala', 'Marinate chicken...\nGrill chicken...\nSimmer in creamy tomato sauce.', '{"calories": {"display": "580-620 kcal", "value": 600}, "carbohydrates": {"display": "15-20 g", "value": 18}, "protein": {"display": "45-50 g", "value": 48}, "fat": {"display": "35-40 g", "value": 37}}', 'INDIAN', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;

-- Japanese Recipes
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (9, 'Teriyaki Salmon', 'Pan-sear salmon...\nGlaze with teriyaki sauce.', '{"calories": {"display": "550-600 kcal", "value": 580}, "carbohydrates": {"display": "20-25 g", "value": 22}, "protein": {"display": "40-45 g", "value": 42}, "fat": {"display": "30-35 g", "value": 33}}', 'JAPANESE', 'https://images.unsplash.com/photo-1732187582879-3ca83139c1b8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine, image_url) VALUES (10, 'Simple Miso Soup', 'Bring dashi to a simmer...\nWhisk in miso paste...\nAdd tofu cubes.', '{"calories": {"display": "80-100 kcal", "value": 80}, "carbohydrates": {"display": "5-8 g", "value": 6}, "protein": {"display": "6-8 g", "value": 7}, "fat": {"display": "3-5 g", "value": 4}}', 'JAPANESE', 'https://plus.unsplash.com/premium_photo-1705406169429-df5950bc2995?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') ON DUPLICATE KEY UPDATE name=name;
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