CREATE DATABASE IF NOT EXISTS stock_exchange;
USE stock_exchange;
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    side VARCHAR(10) NOT NULL,
    instrument VARCHAR(50) NOT NULL,
    limit_price DECIMAL(10, 2) DEFAULT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Ensure the user exists and update its password
CREATE USER IF NOT EXISTS 'lemon_market' @'%' IDENTIFIED BY 'lemon_market';
-- Grant privileges to the user
GRANT ALL PRIVILEGES ON stock_exchange.* TO 'lemon_market' @'%';
-- Apply the changes
FLUSH PRIVILEGES;