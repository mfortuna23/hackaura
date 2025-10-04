const express = require('express');
const path = require('path');
const database = require('./database');  // ← Simpler import

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));

// Initialize database
database.initializeDatabase();  // ← Use database.initializeDatabase()

// API Routes
app.get('/api/users', async (req, res) => {
    try {
        const conn = await database.pool.getConnection();  // ← Use database.pool
        const users = await conn.query('SELECT * FROM users');
        conn.release();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const conn = await database.pool.getConnection();
        const result = await conn.query(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );
        conn.release();
        res.json({ id: result.insertId, name, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
});