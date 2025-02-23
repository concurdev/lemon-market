/**
 * This module sets up and exports a MySQL connection pool using the `mysql2` package.
 * The connection pool is configured based on the database connection details from the
 * application's configuration, ensuring efficient management of multiple simultaneous
 * database connections.
 *
 * By using a connection pool, the application can avoid the overhead of establishing
 * a new connection for every database request, improving performance.
 */

const mysql = require("mysql2");
const config = require("./config");

const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true, // wait for available connections when the pool is busy
  connectionLimit: 10, // maximum number of connections to create in the pool
  queueLimit: 0, // unlimited queue limit (waiting requests will not be discarded)
});

module.exports = pool.promise();
