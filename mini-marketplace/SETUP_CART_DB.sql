-- ============================================
-- SETUP CART AND WISHLIST TABLES
-- Run this entire script in the Supabase SQL Editor
-- ============================================

-- 1. Create cart_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0 AND quantity <= 99),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 2. Create wishlist_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 3. Create indexes (IF NOT EXISTS is not standard SQL for indexes in all versions, but Supabase supports it usually, or we ignore error)
DROP INDEX IF EXISTS idx_cart_items_user_id;
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

DROP INDEX IF EXISTS idx_cart_items_product_id;
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

DROP INDEX IF EXISTS idx_wishlist_items_user_id;
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);

DROP INDEX IF EXISTS idx_wishlist_items_product_id;
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);

-- 4. Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

DROP POLICY IF EXISTS "Users can view their own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can insert their own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can delete their own wishlist items" ON wishlist_items;

-- 6. Re-create RLS Policies
-- Cart Policies
CREATE POLICY "Users can view their own cart items"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Wishlist Policies
CREATE POLICY "Users can view their own wishlist items"
  ON wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items"
  ON wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
  ON wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Triggers
-- Function to update updated_at if not exists (it should exist from initial schema)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
