-- Order Service Schema
SET search_path TO "order";

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    restaurant_id UUID NOT NULL,
    tracking_id UUID NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    failure_messages TEXT
);

-- Order Items table (composite key)
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT NOT NULL,
    order_id UUID NOT NULL REFERENCES orders(id),
    product_id UUID NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    sub_total DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id, order_id)
);

-- Order Address table (one-to-one with orders)
CREATE TABLE IF NOT EXISTS order_address (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id),
    street VARCHAR(255) NOT NULL,
    postal_code VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL
);

-- Customers table (cache from Customer Service)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

-- Payment Outbox table
CREATE TABLE IF NOT EXISTS payment_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    type VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    saga_status VARCHAR(50) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    outbox_status VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL DEFAULT 0
);

-- Approval Outbox table
CREATE TABLE IF NOT EXISTS approval_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    type VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    saga_status VARCHAR(50) NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    outbox_status VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_address_order_id ON order_address(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_outbox_saga_id ON payment_outbox(saga_id);
CREATE INDEX IF NOT EXISTS idx_payment_outbox_status ON payment_outbox(outbox_status, saga_status);
CREATE INDEX IF NOT EXISTS idx_approval_outbox_saga_id ON approval_outbox(saga_id);
CREATE INDEX IF NOT EXISTS idx_approval_outbox_status ON approval_outbox(outbox_status, saga_status);

-- Insert sample customer data (will be synced from Customer Service via Kafka)
INSERT INTO customers (id, username, first_name, last_name) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb41', 'user_1', 'John', 'Doe'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb42', 'user_2', 'Jane', 'Smith'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb43', 'user_3', 'Bob', 'Johnson')
ON CONFLICT (id) DO NOTHING;
