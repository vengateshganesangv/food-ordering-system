-- Payment Service Schema
SET search_path TO "payment";

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    order_id UUID NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_status VARCHAR(50) NOT NULL
);

-- Credit Entry table
CREATE TABLE IF NOT EXISTS credit_entry (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    total_credit_amount DECIMAL(10, 2) NOT NULL
);

-- Credit History table
CREATE TABLE IF NOT EXISTS credit_history (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    credit_entry_id UUID REFERENCES credit_entry(id)
);

-- Payment Outbox table
CREATE TABLE IF NOT EXISTS payment_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    type VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    outbox_status VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_credit_entry_customer_id ON credit_entry(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_history_customer_id ON credit_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_outbox_saga_id ON payment_outbox(saga_id);
CREATE INDEX IF NOT EXISTS idx_payment_outbox_status ON payment_outbox(outbox_status, payment_status);

-- Insert sample credit entries for test customers
INSERT INTO credit_entry (id, customer_id, total_credit_amount) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb51', 'd215b5f8-0249-4dc5-89a3-51fd148cfb41', 500.00),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb52', 'd215b5f8-0249-4dc5-89a3-51fd148cfb42', 1000.00),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb53', 'd215b5f8-0249-4dc5-89a3-51fd148cfb43', 750.00)
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding credit history
INSERT INTO credit_history (id, customer_id, amount, transaction_type, credit_entry_id) VALUES
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb61', 'd215b5f8-0249-4dc5-89a3-51fd148cfb41', 500.00, 'CREDIT', 'd215b5f8-0249-4dc5-89a3-51fd148cfb51'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb62', 'd215b5f8-0249-4dc5-89a3-51fd148cfb42', 1000.00, 'CREDIT', 'd215b5f8-0249-4dc5-89a3-51fd148cfb52'),
    ('d215b5f8-0249-4dc5-89a3-51fd148cfb63', 'd215b5f8-0249-4dc5-89a3-51fd148cfb43', 750.00, 'CREDIT', 'd215b5f8-0249-4dc5-89a3-51fd148cfb53')
ON CONFLICT (id) DO NOTHING;
