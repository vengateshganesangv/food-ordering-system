-- Create schemas for each microservice
CREATE SCHEMA IF NOT EXISTS "customer";
CREATE SCHEMA IF NOT EXISTS "payment";
CREATE SCHEMA IF NOT EXISTS "restaurant";
CREATE SCHEMA IF NOT EXISTS "order";

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA "customer" TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA "payment" TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA "restaurant" TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA "order" TO postgres;
