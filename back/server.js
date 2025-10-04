const express = require('express');
const path = require('path');
const { initializeDatabase, pool } = require('./database').default;

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// Initialize database
initializeDatabase();

// API Routes
app.get('/api/users', async (req, res) => {
    try {
        const conn = await pool.getConnection();
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
        const conn = await pool.getConnection();
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

// Add this route to serve your main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front', 'index.html'));
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
});