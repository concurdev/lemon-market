// Importing required modules
const OrderModel = require("../models/orderModel");
const StockExchange = require("../models/stockExchange");
const logger = require("../utils/logger");

/**
 * Controller to handle the placement of orders
 * This class contains methods for processing order requests, validating data,
 * and interacting with both the database and the stock exchange.
 */
class OrderController {
  /**
   * Place a new order
   * This method handles the order placement process by validating the data,
   * creating an order in the database, and attempting to place the order
   * on a stock exchange. If any step fails, appropriate error responses are returned.
   *
   * @param {Object} req - The request object containing order details in the body
   * @param {Object} res - The response object to send the result of the order operation
   */
  static async placeOrder(req, res) {
    try {
      // Destructure order data from the request body
      const { type, side, instrument, limit_price, quantity } = req.body;

      // Validate required fields in the order
      if (!type || !side || !instrument || !quantity) {
        return res.status(400).json({ message: "Missing required order fields" });
      }

      // Create the order in the database
      const newOrder = await OrderModel.createOrder(type, side, instrument, limit_price, quantity);

      // Try to place the order on the stock exchange
      try {
        await StockExchange.placeOrder(newOrder);
        // If successful, return the created order
        return res.status(201).json(newOrder);
      } catch (stockError) {
        // Log error and return failure response for stock exchange issues
        logger.error("Error placing order at stock exchange:", stockError);
        return res.status(500).json({ message: "Internal server error while placing the order" });
      }
    } catch (error) {
      // Log error and return general server error if any exception occurs
      logger.error("Error processing order:", error);
      res.status(500).json({ message: "Internal server error while placing the order" });
    }
  }
}

module.exports = OrderController;
