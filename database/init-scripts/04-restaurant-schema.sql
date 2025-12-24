-- Restaurant Service Schema
SET search_path TO "restaurant";

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

-- Restaurant Products table (for order validation)
CREATE TABLE IF NOT EXISTS restaurant_products (
    id UUID PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    product_id UUID NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(restaurant_id, product_id)
);

-- Order Approval table
CREATE TABLE IF NOT EXISTS order_approval (
    id UUID PRIMARY KEY,
    restaurant_id UUID NOT NULL,
    order_id UUID NOT NULL,
    approval_status VARCHAR(50) NOT NULL
);

-- Approval Outbox table
CREATE TABLE IF NOT EXISTS approval_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    type VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    outbox_status VARCHAR(50) NOT NULL,
    approval_status VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_products_restaurant_id ON restaurant_products(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_approval_restaurant_id ON order_approval(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_approval_order_id ON order_approval(order_id);
CREATE INDEX IF NOT EXISTS idx_approval_outbox_saga_id ON approval_outbox(saga_id);
CREATE INDEX IF NOT EXISTS idx_approval_outbox_status ON approval_outbox(outbox_status, approval_status);

-- Insert sample restaurants
INSERT INTO restaurants (id, name, active) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb45', 'Restaurant 1', true),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb46', 'Restaurant 2', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products for Restaurant 1
INSERT INTO restaurant_products (id, restaurant_id, product_id, product_name, price, available) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb71', 'd215b5f8-0249-4dc5-89a3-51fd148cfb45', 'd215b5f8-0249-4dc5-89a3-51fd148cfb48', 'Product 1', 50.00, true),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb72', 'd215b5f8-0249-4dc5-89a3-51fd148cfb45', 'd215b5f8-0249-4dc5-89a3-51fd148cfb49', 'Product 2', 50.00, true),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb73', 'd215b5f8-0249-4dc5-89a3-51fd148cfb45', 'd215b5f8-0249-4dc5-89a3-51fd148cfb50', 'Product 3', 50.00, true)
ON CONFLICT (restaurant_id, product_id) DO NOTHING;

-- Insert sample products for Restaurant 2
INSERT INTO restaurant_products (id, restaurant_id, product_id, product_name, price, available) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb74', 'd215b5f8-0249-4dc5-89a3-51fd148cfb46', 'd215b5f8-0249-4dc5-89a3-51fd148cfb48', 'Product 1', 60.00, true),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb75', 'd215b5f8-0249-4dc5-89a3-51fd148cfb46', 'd215b5f8-0249-4dc5-89a3-51fd148cfb49', 'Product 2', 60.00, true)
ON CONFLICT (restaurant_id, product_id) DO NOTHING;
