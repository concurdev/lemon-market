/**
 * This module set up the logger with `winston`.
 * It logs messages at 'info' level by default and colors levels for easier read.
 * Logs go to console and a file with timestamps and app name.
 * It's customizable for dev, prod and different environments, with colors for info, warn, error.
 */

const { createLogger, transports, format } = require("winston");
const packageJson = require("../../package.json");
const { RED_COLOR, RESET_COLOR, YELLOW_COLOR, CYAN_COLOR } = require("../utils/constants");

// Create and configure the logger
const logger = createLogger({
  level: "info", // default logging level to 'info'
  format: format.combine(
    format.timestamp(), // include a timestamp with each log entry
    format.printf(({ timestamp, level, message }) => {
      let coloredLevel;

      // Assign colors based on the log level
      switch (level.toUpperCase()) {
        case "INFO":
          coloredLevel = `${CYAN_COLOR}${level.toUpperCase().padEnd(5)}${RESET_COLOR}`;
          break;
        case "ERROR":
          coloredLevel = `${RED_COLOR}${level.toUpperCase().padEnd(5)}${RESET_COLOR}`;
          break;
        case "WARN":
          coloredLevel = `${YELLOW_COLOR}${level.toUpperCase().padEnd(5)}${RESET_COLOR}`;
          break;
        default:
          coloredLevel = `${level.toUpperCase().padEnd(5)}`;
      }

      // Format the log entry with timestamp, log level, application name, and the message
      return `${timestamp} | ${coloredLevel} | [${packageJson.name}]: ${message}`;
    })
  ),
  transports: [new transports.Console(), new transports.File({ filename: "logs/app.log" })],
});

module.exports = logger;
