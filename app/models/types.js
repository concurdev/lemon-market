/**
 * The OrderSide object represents the two possible sides of an order.
 * These constants define the direction in which the order is placed.
 * - BUY: Represents a buy order (when you want to purchase a security).
 * - SELL: Represents a sell order (when you want to sell a security).
 */
const OrderSide = {
  BUY: "buy", // The 'buy' side of an order, indicating an intent to purchase
  SELL: "sell", // The 'sell' side of an order, indicating an intent to sell
};

/**
 * The OrderType object defines the types of orders that can be placed.
 * - MARKET: Represents an order that is executed at the best available market price.
 * - LIMIT: Represents an order that is placed at a specific price or better.
 */
const OrderType = {
  MARKET: "market", // A market order, which is executed immediately at the current price
  LIMIT: "limit", // A limit order, which is placed at a specific price or better
};

// Export the OrderSide and OrderType objects to be used in other parts of the application
module.exports = { OrderSide, OrderType };
