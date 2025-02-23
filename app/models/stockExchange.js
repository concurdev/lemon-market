const logger = require("../utils/logger");

/**
 * Custom error class for handling order placement errors
 * Extends the base Error class to create a specialized error for stock exchange order placement failures.
 */
class OrderPlacementError extends Error {
  constructor(message) {
    super(message);
    this.name = "OrderPlacementError"; // Set custom error name
  }
}

/**
 * StockExchange class responsible for interacting with the stock exchange API
 * This class contains a method to place an order, simulating potential failure scenarios
 * and logging outcomes of the operation.
 */
class StockExchange {
  /**
   * Place an order on the stock exchange
   * This method simulates placing an order and logs the result. It also includes logic for error handling
   * in case of invalid input or failure during the process, with random failure simulation for realism.
   *
   * @param {Object} order - The order object that contains details about the order
   * @returns {Promise} Resolves with the order object if successful, or rejects with an OrderPlacementError if fails
   */
  static async placeOrder(order) {
    return new Promise((resolve, reject) => {
      try {
        // Validate the order parameter to ensure it's an object
        if (!order || typeof order !== "object") {
          return reject(new OrderPlacementError("Invalid order parameter provided"));
        }

        // Simulate an occasional failure (10% chance of failure)
        if (Math.random() >= 0.9) {
          return reject(new OrderPlacementError("Failed to place order at stock exchange."));
        }

        // Simulate the asynchronous order placement process with a timeout
        setTimeout(() => {
          try {
            // Log the order placement success
            logger.info(`Order placed successfully: ${JSON.stringify(order)}`);
            resolve(order); // Resolve with the order on success
          } catch (logError) {
            // Catch errors during logging
            reject(new OrderPlacementError("Logging failed: " + logError.message));
          }
        }, 500); // Simulate a 500ms delay for placing the order
      } catch (error) {
        // Catch any unexpected errors
        reject(new OrderPlacementError("Unexpected error: " + error.message));
      }
    });
  }
}

module.exports = StockExchange;
