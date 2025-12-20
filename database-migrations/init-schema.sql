-- Database initialization for Food Ordering System
-- PostgreSQL

-- Create schemas
CREATE SCHEMA IF NOT EXISTS "order";
CREATE SCHEMA IF NOT EXISTS payment;
CREATE SCHEMA IF NOT EXISTS restaurant;
CREATE SCHEMA IF NOT EXISTS customer;

-- Create types
CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'APPROVED', 'CANCELLING', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('COMPLETED', 'CANCELLED', 'FAILED');
CREATE TYPE saga_status AS ENUM ('STARTED', 'FAILED', 'SUCCEEDED', 'PROCESSING', 'COMPENSATING', 'COMPENSATED');
CREATE TYPE outbox_status AS ENUM ('STARTED', 'COMPLETED', 'FAILED');

-- ORDER SCHEMA TABLES
CREATE TABLE IF NOT EXISTS "order".orders (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    restaurant_id UUID NOT NULL,
    tracking_id UUID NOT NULL UNIQUE,
    price NUMERIC(10,2) NOT NULL,
    order_status order_status NOT NULL,
    failure_messages VARCHAR
);

CREATE TABLE IF NOT EXISTS "order".order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    sub_total NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES "order".orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "order".order_address (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL UNIQUE,
    street VARCHAR NOT NULL,
    postal_code VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    FOREIGN KEY (order_id) REFERENCES "order".orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "order".payment_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ,
    type VARCHAR NOT NULL,
    payload JSONB NOT NULL,
    outbox_status outbox_status NOT NULL,
    saga_status saga_status NOT NULL,
    order_status order_status NOT NULL,
    version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "order".approval_outbox (
    id UUID PRIMARY KEY,
    saga_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ,
    type VARCHAR NOT NULL,
    payload JSONB NOT NULL,
    outbox_status outbox_status NOT NULL,
    saga_status saga_status NOT NULL,
    order_status order_status NOT NULL,
    version INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_payment_outbox_saga ON "order".payment_outbox(type, outbox_status, saga_status);
CREATE INDEX idx_approval_outbox_saga ON "order".approval_outbox(type, outbox_status, saga_status);

-- PAYMENT SCHEMA TABLES
CREATE TABLE IF NOT EXISTS payment.payments (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    order_id UUID NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    payment_status payment_status NOT NULL
);

-- RESTAURANT SCHEMA TABLES
CREATE TABLE IF NOT EXISTS restaurant.order_approval (
    id UUID PRIMARY KEY,
    restaurant_id UUID NOT NULL,
    order_id UUID NOT NULL,
    approval_status VARCHAR NOT NULL,
    failure_messages VARCHAR
);

-- CUSTOMER SCHEMA TABLES
CREATE TABLE IF NOT EXISTS customer.customers (
    id UUID PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL
);
