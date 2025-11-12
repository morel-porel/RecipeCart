-- Insert some sample ingredients (this part is fine)
-- Use separate statements for maximum compatibility.
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (101, 'Tomato', 100, 'pcs', 0.50) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (102, 'Pasta', 50, 'g', 0.10) ON DUPLICATE KEY UPDATE name=name;
INSERT INTO ingredients (id, name, stock_level, unit, price) VALUES (103, 'Onion', 75, 'pcs', 0.25) ON DUPLICATE KEY UPDATE name=name;

-- Step 1: Insert the recipes using separate, complete statements.
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (1, 'Simple Pasta', '1. Boil pasta. 2. Add tomatoes.', 'Calories: 400', 'Italian') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO recipes (id, name, instructions, nutrition_facts, cuisine) VALUES (2, 'Vegan Delight', '1. Chop vegetables. 2. Stir fry.', 'Calories: 300', 'Chinese') ON DUPLICATE KEY UPDATE name=name;

-- Step 2: Now, populate the join tables.
-- Each of these should also be its own statement.
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (1, 'GLUTEN') ON DUPLICATE KEY UPDATE allergen=allergen;
INSERT INTO recipe_allergens (recipe_id, allergen) VALUES (2, 'SOY') ON DUPLICATE KEY UPDATE allergen=allergen;

-- This populates the recipe_dietary_tags table.
INSERT INTO recipe_dietary_tags (recipe_id, tag) VALUES (2, 'VEGAN') ON DUPLICATE KEY UPDATE tag=tag;