const pool = require("../utils/database");
const { OrderType, OrderSide } = require("../models/types");

/**
 * Order model class to handle operations related to orders
 * This model contains methods to create new orders in the database,
 * validate order data, and manage transactions for consistency.
 */
class OrderModel {
  /**
   * Create a new order in the database
   * This method handles the creation of new orders by validating the input data,
   * ensuring proper order type and side, and then inserting the order into the database
   * with proper transaction management.
   *
   * @param {string} type - The type of the order (MARKET or LIMIT)
   * @param {string} side - The side of the order (BUY or SELL)
   * @param {string} instrument - The trading instrument (e.g., 'BTC-USD')
   * @param {number} limit_price - The limit price for the order (used for LIMIT orders)
   * @param {number} quantity - The quantity of the instrument to be ordered
   * @returns {Object} The created order object, including the order details and timestamp
   * @throws {Error} If there is any validation failure or database error
   */
  static async createOrder(type, side, instrument, limit_price, quantity) {
    // Validate that the order type and side are valid
    if (!Object.values(OrderType).includes(type) || !Object.values(OrderSide).includes(side)) {
      throw new Error("Invalid order type or side");
    }

    // Validate that market orders do not have a limit price
    if (type === OrderType.MARKET && limit_price !== undefined) {
      throw new Error("Market orders cannot have a limit price");
    }

    // Validate that limit orders require a limit price
    if (type === OrderType.LIMIT && !limit_price) {
      throw new Error("Limit orders require a limit price");
    }

    let connection;
    try {
      // Get a connection from the pool
      connection = await pool.getConnection();
      await connection.beginTransaction(); // Start a new transaction for the order

      // insert the new order into the 'orders' table
      const [result] = await connection.execute(
        "INSERT INTO orders (type, side, instrument, limit_price, quantity, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [type, side, instrument, limit_price || null, quantity]
      );

      // Construct the order object to return
      const order = {
        id: result.insertId, // The generated ID from the insertion
        type,
        side,
        instrument,
        limit_price,
        quantity,
        created_at: new Date().toISOString(), // Timestamp for order creation
      };

      // Commit the transaction if successful
      await connection.commit();
      return order; // Return the created order object
    } catch (error) {
      // Rollback the transaction in case of an error
      if (connection) await connection.rollback();
      throw new Error("Database error while creating order: " + error.message); // Throw error for higher-level handling
    } finally {
      // Always release the connection back to the pool, regardless of success or failure
      if (connection) connection.release();
    }
  }
}

module.exports = OrderModel;
