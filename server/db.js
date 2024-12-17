const { Pool } = require("pg");
require('dotenv').config();

// Use DATABASE_URL for Render deployment
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // Use the DATABASE_URL directly
    ssl: {
        rejectUnauthorized: false  // Required for Render’s PostgreSQL connection
    }
});

module.exports = pool;
