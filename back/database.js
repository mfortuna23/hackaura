const mariadb = require('mariadb');

// Railway automatically provides these environment variables
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 5
});

async function initializeDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Cloud database ready!');
    } catch (err) {
        console.error('❌ Database error:', err);
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { initializeDatabase, pool };