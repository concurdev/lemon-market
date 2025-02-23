/**
 * This application provides an API for placing orders via a POST request to "/api/orders".
 *
 * The order placement process is designed to simulate placing a trade at a stock exchange.
 *
 * The server handles incoming orders, stores them in a database, and ensures the order
 * is placed at the stock exchange while maintaining reliability and scalability.
 * If the process fails, it returns a 500 status code with an error message.
 * The API is built to be resilient, ensuring that failures in the stock exchange
 * do not impact the order placement functionality.
 */

const express = require("express");
const logger = require("./app/utils/logger");
const config = require("./app/utils/config");
const orderRoutes = require("./app/routes/orderRoutes");

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies of incoming requests
app.use(express.json());

// Set up the route for handling order-related API requests
// All order-related requests will be handled under "/api/orders"
app.use("/api/orders", orderRoutes);

// Start the server and listen on the port specified in the config file
// Logs a message once the server starts successfully
app.listen(config.PORT, () => logger.info(`Server running on http://${config.HOST}:${config.PORT}`));

module.exports = app; // Export the app for testing
