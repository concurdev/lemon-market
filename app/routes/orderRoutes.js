/**
 * This module defines the routes related to orders.
 * It uses Express router to map incoming HTTP requests to corresponding controller methods.
 *
 * The main responsibility of this router is to handle order-related API requests, such as placing orders.
 * In this case, it specifically handles HTTP POST requests to the "/api/orders" endpoint to create a new order.
 */

const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router(); // instance for handling order-related routes

// POST route for creating an order when a POST request is made to "/api/orders", the placeOrder method is invoked
router.post("/", orderController.placeOrder);

module.exports = router;
