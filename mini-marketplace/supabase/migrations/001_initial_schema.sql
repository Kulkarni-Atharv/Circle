-- Mini-Marketplace Database Schema
-- This migration creates the initial database schema for the marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile information
-- Linked to auth.users via foreign key

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
-- Allow users to read all profiles (to see seller information)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
-- Stores product listings

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  description TEXT NOT NULL,
  images TEXT[] NOT NULL CHECK (array_length(images, 1) > 0 AND array_length(images, 1) <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products table
-- Allow everyone to read all products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Allow authenticated users to insert products
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own products
CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own products
CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Create storage bucket for product images
-- Note: This needs to be run in Supabase Dashboard or via Supabase CLI

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true);

-- Storage policies for product-images bucket
-- CREATE POLICY "Anyone can view product images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');

-- CREATE POLICY "Authenticated users can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'product-images' AND
--     auth.role() = 'authenticated'
--   );

-- CREATE POLICY "Users can update their own product images"
--   ON storage.objects FOR UPDATE
--   USING (
--     bucket_id = 'product-images' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can delete their own product images"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'product-images' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
