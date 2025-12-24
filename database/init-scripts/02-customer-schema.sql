-- Customer Service Schema
SET search_path TO "customer";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_username ON customers(username);

-- Insert sample data
INSERT INTO customers (id, username, first_name, last_name) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb41', 'user_1', 'John', 'Doe'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb42', 'user_2', 'Jane', 'Smith'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb43', 'user_3', 'Bob', 'Johnson')
ON CONFLICT (id) DO NOTHING;
