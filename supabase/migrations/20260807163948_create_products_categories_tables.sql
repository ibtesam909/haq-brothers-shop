/*
# Create products and categories tables for Haq Brothers shop

1. New Tables
- `categories`
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `slug` (text, unique, not null)
  - `image` (text, default placeholder)
  - `icon` (text, default empty)
  - `description` (text, default empty)
  - `parent_category` (text, nullable)
  - `parent_slug` (text, nullable)
  - `featured` (boolean, default false)
  - `display_order` (integer, default 0)
  - `count` (integer, default 0)
  - `created_at` (timestamptz, default now)
  - `updated_at` (timestamptz, default now)
- `products`
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `slug` (text, unique, not null)
  - `description` (text, default empty)
  - `short_description` (text, default empty)
  - `category` (text, not null)
  - `category_slug` (text, not null, indexed)
  - `subcategory` (text, default empty)
  - `brand` (text, default 'Haq Pro')
  - `images` (jsonb, default empty array)
  - `thumbnail` (text, default placeholder)
  - `price` (numeric, not null, min 0)
  - `compare_price` (numeric, default 0)
  - `stock_quantity` (integer, default 0, min 0)
  - `sku` (text, default empty)
  - `featured` (boolean, default false)
  - `best_seller` (boolean, default false)
  - `new_arrival` (boolean, default false)
  - `rating` (numeric, default 0, 0-5)
  - `reviews_count` (integer, default 0)
  - `specifications` (jsonb, default empty object)
  - `tags` (jsonb, default empty array)
  - `status` (text, default 'active', indexed, enum: active/hidden/out_of_stock)
  - `created_at` (timestamptz, default now)
  - `updated_at` (timestamptz, default now)
2. Security
- Enable RLS on both tables.
- This is a no-auth admin app (no sign-in screen required for the products management task).
- Allow anon + authenticated CRUD on both tables because the admin console manages shared store data.
3. Indexes
- products: category_slug, status, featured, created_at
- categories: slug (unique), display_order
4. Notes
- JSONB used for arrays/objects to match the Mongoose schema shape (images, tags, specifications).
- updated_at auto-updates via trigger on UPDATE.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL DEFAULT '/placeholder.svg',
  icon text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  parent_category text,
  parent_slug text,
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories (display_order);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  category text NOT NULL,
  category_slug text NOT NULL,
  subcategory text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT 'Haq Pro',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  thumbnail text NOT NULL DEFAULT '/placeholder.svg',
  price numeric NOT NULL DEFAULT 0 CHECK (price >= 0),
  compare_price numeric NOT NULL DEFAULT 0,
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  sku text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  best_seller boolean NOT NULL DEFAULT false,
  new_arrival boolean NOT NULL DEFAULT false,
  rating numeric NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count integer NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'out_of_stock')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products (category_slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- Auto-update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
