---
# lemon-market stock exchange

This project is a simple REST API that handles placing orders to a simulated stock exchange and stores order data in a MySQL database. It provides endpoints for creating orders and interacting with both the database and the stock exchange system.
---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Endpoints](#endpoints)
- [How to Use the Endpoint](#how-to-use-the-endpoint)
- [Code Explanation](#code-explanation)
- [Test Suite](#test-suite)
- [Installation and Setup](#installation-and-setup)

---

## Overview

This API allows users to create stock orders and submit them to a simulated stock exchange. The orders are stored in a MySQL database for persistence. The system includes basic validation for the order data and handles stock exchange failures with retries and error handling.

---

## Technology Stack

- **Node.js** - JavaScript runtime for the backend server.
- **Express.js** - Web framework for building the REST API.
- **MySQL** - Relational database management system for storing order data.
- **Jest** - Testing framework for writing unit and integration tests.
- **Supertest** - HTTP assertion library for testing HTTP requests.

---

## Database Schema

The application uses MySQL to store order data in a database. The table schema is as follows:

### `stock_exchange` Schema

The database schema is named `stock_exchange` and contains the following tables:

#### `orders` Table

##### CREATE TABLE Statement:

```sql
CREATE TABLE stock_exchange.orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  side VARCHAR(10) NOT NULL,
  instrument VARCHAR(50) NOT NULL,
  limit_price DECIMAL(10, 2) DEFAULT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `stocks` Table

##### CREATE TABLE Statement:

```sql
CREATE TABLE stock_exchange.stocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(50) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Endpoints

### `POST /api/orders`

**Description**:  
This endpoint is used to create a new stock order. The order will be stored in the MySQL database and then sent to the simulated stock exchange system. If the stock exchange interaction fails, the order will still be saved in the database.

#### Request Body

```json
{
  "type": "LIMIT", // The type of the order (LIMIT or MARKET)
  "side": "BUY", // The side of the order (BUY or SELL)
  "instrument": "AAPL", // The instrument being traded (e.g., AAPL, TSLA)
  "limit_price": 150.0, // The limit price for LIMIT orders (optional for MARKET)
  "quantity": 100 // The quantity of the instrument to buy or sell
}
```

- **type**: The type of the order. Can either be "LIMIT" or "MARKET".
- **side**: The side of the order. Can either be "BUY" or "SELL".
- **instrument**: The symbol of the instrument being traded (e.g., "AAPL" for Apple stock).
- **limit_price**: The price limit for the order (only applicable for LIMIT orders). If the order type is "MARKET", this field can be omitted.
- **quantity**: The number of shares to buy or sell.

#### Response

```json
{
  "id": 1,
  "type": "LIMIT",
  "side": "BUY",
  "instrument": "AAPL",
  "limit_price": 150.0,
  "quantity": 100,
  "created_at": "2025-02-22T12:00:00Z"
}
```

- **id**: Unique identifier for the order in the database.
- **type**: The type of the order (LIMIT or MARKET).
- **side**: The side of the order (BUY or SELL).
- **instrument**: The instrument being traded.
- **limit_price**: The limit price if it’s a LIMIT order (null if MARKET).
- **quantity**: The quantity of shares.
- **created_at**: Timestamp of when the order was created.

---

## How to Use the Endpoint

1. **Make a POST request** to `/api/orders`.
2. **Provide the required data** in the request body:
   - Type: "LIMIT" or "MARKET"
   - Side: "BUY" or "SELL"
   - Instrument: The stock symbol (e.g., "AAPL")
   - Limit Price: Only required for LIMIT orders.
   - Quantity: The number of shares.
3. **Response**: The order will be saved in the database, and an attempt will be made to place the order with the stock exchange. A success message will be returned.

### Example Request:

```bash
curl -X POST http://0.0.0.0:3891/api/orders \
-H "Content-Type: application/json" \
-d '{"type": "LIMIT", "side": "BUY", "instrument": "AAPL", "limit_price": 150.00, "quantity": 100}'
```

---

## Code Explanation

### 1. **Order Model (`orderModel.js`)**:

- **Purpose**: Manages interaction with the MySQL database for order creation.
- **Why**: Orders are stored in the database for persistence, and this model ensures that the data is validated and inserted correctly.
- **What’s Done**:
  - The `createOrder` method validates the order data (type, side, limit_price) and inserts it into the `orders` table in the `stock_exchange` database.
  - A transaction is used to ensure that if any error occurs during the insertion, the changes are rolled back.

### 2. **Order Controller (`orderController.js`)**:

- **Purpose**: Handles HTTP requests, calls the model, and manages stock exchange interactions.
- **Why**: Separates concerns between HTTP handling and business logic. Ensures scalability and error handling.
- **What’s Done**:
  - The `placeOrder` method accepts the order details from the user, validates the order, saves it in the database, and attempts to place the order with the stock exchange. If the stock exchange placement fails, the database record still gets created, ensuring no data is lost.

### 3. **Stock Exchange Model (`stockExchange.js`)**:

- **Purpose**: Simulates interaction with the stock exchange, attempting to place the order.
- **Why**: This model abstracts the stock exchange logic and handles the interaction separately from the database.
- **What’s Done**:
  - The `placeOrder` method simulates order placement and occasionally fails to simulate real-world stock exchange failures. In case of a failure, a detailed error message is logged, and the error is returned to the controller.

### 4. **Error Handling**:

- **Purpose**: Ensures graceful failure and logs errors for debugging.
- **Why**: If the stock exchange service fails, we don’t want to lose the order data, so we log the failure and return a meaningful response to the user.
- **What’s Done**:
  - The order is created in the database even if placing the order at the stock exchange fails. The error is logged and sent as a response to the client.

### 5. **Testing with Jest and Supertest**:

- **Purpose**: Ensure that the order creation logic works correctly and the integration with the stock exchange service is functioning.
- **Why**: Testing ensures that the API behaves as expected, both under normal conditions and when the stock exchange fails.
- **What’s Done**:
  - Jest tests are written to simulate POST requests to the `/api/orders` endpoint and check both successful and failed interactions with the stock exchange.

---

## Test Suite

Run the tests with the following command:

```bash
npm test
```

This will run Jest tests that ensure that the orders are being created correctly and the interaction with the stock exchange works as expected.

---

## Installation and Setup

1. **Clone the repository**:

   ```bash
   git clone git@github.com:concurdev/lemon-market.git
   cd lemon-market
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up the database**:

   - Ensure MySQL is installed and running.
   - Create a database called `stock_exchange` and run the SQL schema provided above to create the `orders` and `stocks` tables.
   - Set up the database credentials in the `.env` file.

4. **Run the server**:

   ```bash
   npm start
   ```

   The server will start on `http://0.0.0.0:3891`.

## Running the Application with Docker

### Docker Setup

This project includes a `docker-compose.yml` file that starts the following services:

- **MySQL Container**: Runs MySQL with the user defined in the `.env` file.
- **Node.js Application Container**: Runs the Express.js backend.

To run the project in Docker:

1. **Ensure Docker is installed**.
2. **Build and start the application**:

   ```bash
   docker-compose up --build
   ```

   This will start two containers:

   - `mysql-container`: MySQL database with the user defined in the `.env` file.
   - `lemon-market-service-container`: Node.js backend running the API.

3. **Access the API** at:

   ```bash
   http://0.0.0.0:3891/api/orders
   ```

4. **Stopping the containers**:

   ```bash
   docker-compose down
   ```

---

## Why Root Password is Used in `docker-compose.yml`?

In the `docker-compose.yml`, the MySQL container is set up with the `root` password for development purposes:

```yaml
environment:
  MYSQL_ROOT_PASSWORD: rootpassword
  MYSQL_DATABASE: ${DB_NAME}
  MYSQL_USER: ${DB_USER}
  MYSQL_PASSWORD: ${DB_PASSWORD}
```

- The root password is required to allow full database access during development.
- The `lemon_market` user (or the user defined in `.env`) is created for regular database operations.
- **Important**: Using the root password in a production setup is insecure. This setup is only for demonstration purposes to make it easy to inspect the database.

---

## Running Commands Inside the Container

To access the MySQL container and interact with the database:

```bash
docker exec -it mysql-container mysql -u root -p
```

To enter the Node.js application container:

```bash
docker exec -it lemon-market_service_container sh
```

From inside the application container, you can run:

```bash
npm start
```

---

## Running Tests

```bash
npm test
```

---

## Notes:

```

- The `mysql-container` is the hostname of the MySQL container, and it is used by the `lemon-market-service-container` to connect to the database.

---
```
