import { createPool } from 'mariadb';

const pool = createPool({
    host: 'localhost',
    user: 'root', 
    password: '',  // Empty password for local
    database: 'hackathon_db',
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
        
        console.log('✅ Database ready!');
    } catch (err) {
        console.error('❌ Database error:', err);
    } finally {
        if (conn) conn.release();
    }
}

export default { pool, initializeDatabase };