/**
 * This module loads config from `.env` using `dotenv`.
 * It exports a `config` object with things like DB details and port.
 * The values are checked to make sure they are set before app starts.
 */

const dotenv = require("dotenv");
dotenv.config();

// define configuration object with values from environment variables
const config = {
  HOST: process.env.HOST,
  PORT: parseInt(process.env.PORT, 10),

  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};

// Type checks and validation of configuration values
if (isNaN(config.PORT)) {
  throw new Error("PORT must be a number");
}

if (!config.DB_HOST || !config.DB_USER || !config.DB_PASSWORD || !config.DB_NAME) {
  throw new Error("Database configuration is incomplete");
}

module.exports = config;
