-- Create schemas for each microservice
CREATE SCHEMA IF NOT EXISTS "order";
CREATE SCHEMA IF NOT EXISTS customer;
CREATE SCHEMA IF NOT EXISTS payment;
CREATE SCHEMA IF NOT EXISTS restaurant;

-- Customer Service Tables
CREATE TABLE IF NOT EXISTS customer.customers (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

-- Order Service Tables
CREATE TABLE IF NOT EXISTS "order".customers (
    id UUID PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "order".restaurants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS "order".products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS "order".restaurant_products (
    restaurant_id UUID NOT NULL,
    product_id UUID NOT NULL,
    PRIMARY KEY (restaurant_id, product_id),
    FOREIGN KEY (restaurant_id) REFERENCES "order".restaurants(id),
    FOREIGN KEY (product_id) REFERENCES "order".products(id)
);

CREATE TABLE IF NOT EXISTS "order".orders (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    restaurant_id UUID NOT NULL,
    tracking_id UUID UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    failure_messages TEXT,
    FOREIGN KEY (customer_id) REFERENCES "order".customers(id),
    FOREIGN KEY (restaurant_id) REFERENCES "order".restaurants(id)
);

CREATE TABLE IF NOT EXISTS "order".order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    sub_total NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES "order".orders(id),
    FOREIGN KEY (product_id) REFERENCES "order".products(id)
);

CREATE TABLE IF NOT EXISTS "order".order_address (
    id UUID PRIMARY KEY,
    order_id UUID UNIQUE NOT NULL,
    street VARCHAR(255) NOT NULL,
    postal_code VARCHAR(50) NOT NULL,
    city VARCHAR(255) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES "order".orders(id)
);

CREATE TABLE IF NOT EXISTS "order".payment_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    outbox_status VARCHAR(50) NOT NULL,
    saga_status VARCHAR(50) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS payment_outbox_saga_status_idx
    ON "order".payment_outbox (outbox_status, saga_status);

CREATE TABLE IF NOT EXISTS "order".restaurant_approval_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    outbox_status VARCHAR(50) NOT NULL,
    saga_status VARCHAR(50) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS restaurant_approval_outbox_saga_status_idx
    ON "order".restaurant_approval_outbox (outbox_status, saga_status);

-- Payment Service Tables
CREATE TABLE IF NOT EXISTS payment.payments (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    order_id UUID NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment.credit_entry (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    total_credit_amount NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment.credit_history (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment.order_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    outbox_status VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS payment_outbox_status_idx
    ON payment.order_outbox (outbox_status);

-- Restaurant Service Tables
CREATE TABLE IF NOT EXISTS restaurant.restaurants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS restaurant.products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    available BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS restaurant.restaurant_products (
    restaurant_id UUID NOT NULL,
    product_id UUID NOT NULL,
    PRIMARY KEY (restaurant_id, product_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurant.restaurants(id),
    FOREIGN KEY (product_id) REFERENCES restaurant.products(id)
);

CREATE TABLE IF NOT EXISTS restaurant.order_approval (
    id UUID PRIMARY KEY,
    restaurant_id UUID NOT NULL,
    order_id UUID NOT NULL,
    approval_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant.restaurants(id)
);

CREATE TABLE IF NOT EXISTS restaurant.order_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    outbox_status VARCHAR(50) NOT NULL,
    approval_status VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS restaurant_outbox_status_idx
    ON restaurant.order_outbox (outbox_status);

-- Insert sample data for testing
-- Sample customers
INSERT INTO customer.customers (id, username, first_name, last_name) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb41', 'user_1', 'John', 'Doe'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb42', 'user_2', 'Jane', 'Smith')
ON CONFLICT (id) DO NOTHING;

-- Copy customers to order schema
INSERT INTO "order".customers (id) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb41'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb42')
ON CONFLICT (id) DO NOTHING;

-- Sample restaurants
INSERT INTO restaurant.restaurants (id, name, active) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb45', 'Restaurant 1', true),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb46', 'Restaurant 2', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "order".restaurants (id, name, active) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb45', 'Restaurant 1', true),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb46', 'Restaurant 2', true)
ON CONFLICT (id) DO NOTHING;

-- Sample products
INSERT INTO restaurant.products (id, name, price, available) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb47', 'Pizza', 12.50, true),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb48', 'Burger', 8.75, true),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb49', 'Salad', 6.50, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "order".products (id, name, price) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb47', 'Pizza', 12.50),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb48', 'Burger', 8.75),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb49', 'Salad', 6.50)
ON CONFLICT (id) DO NOTHING;

-- Link products to restaurants
INSERT INTO restaurant.restaurant_products (restaurant_id, product_id) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb45', 'd215b5f8-0249-4dc5-89a3-51fd148cfb47'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb45', 'd215b5f8-0249-4dc5-89a3-51fd148cfb48'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb46', 'd215b5f8-0249-4dc5-89a3-51fd148cfb49')
ON CONFLICT (restaurant_id, product_id) DO NOTHING;

INSERT INTO "order".restaurant_products (restaurant_id, product_id) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb45', 'd215b5f8-0249-4dc5-89a3-51fd148cfb47'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb45', 'd215b5f8-0249-4dc5-89a3-51fd148cfb48'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb46', 'd215b5f8-0249-4dc5-89a3-51fd148cfb49')
ON CONFLICT (restaurant_id, product_id) DO NOTHING;

-- Sample credit entries
INSERT INTO payment.credit_entry (id, customer_id, total_credit_amount) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb43', 'd215b5f8-0249-4dc5-89a3-51fd148cfb41', 500.00),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb44', 'd215b5f8-0249-4dc5-89a3-51fd148cfb42', 1000.00)
ON CONFLICT (id) DO NOTHING;
