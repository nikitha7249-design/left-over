const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Auth Routes (Mock for now, but connected to DB logic)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        // Basic DB check
        const result = await db.query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, password, name, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register', details: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length > 0) {
            res.json({ token: 'mock-token', user: result.rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ========== FOOD ITEMS ROUTES ==========

// Create a new food listing
app.post('/api/food', async (req, res) => {
    try {
        const { title, description, quantity, food_type, event_name, contact_phone, pickup_time, latitude, longitude, address } = req.body;
        const result = await db.query(
            `INSERT INTO food_items (host_id, title, description, quantity, food_type, event_name, contact_phone, pickup_time, latitude, longitude, address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [req.body.host_id || 1, title, description, quantity, food_type, event_name, contact_phone, pickup_time, latitude, longitude, address]
        );
        res.status(201).json({ success: true, food: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create food listing', details: err.message });
    }
});

// Get all food listings
app.get('/api/food', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM food_items ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch food listings' });
    }
});

// Get a single food listing
app.get('/api/food/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM food_items WHERE id = $1', [req.params.id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Food listing not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch food listing' });
    }
});

// Update food status (claim/complete)
app.patch('/api/food/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const result = await db.query(
            'UPDATE food_items SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Food listing not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// ========== BOOKING ROUTES ==========

// Claim a food item (NGO books it)
app.post('/api/food/:id/claim', async (req, res) => {
    try {
        const { ngo_id, ngo_name } = req.body;
        // Check if already claimed
        const check = await db.query('SELECT * FROM food_items WHERE id = $1', [req.params.id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Food listing not found' });
        }
        if (check.rows[0].status !== 'available') {
            return res.status(400).json({ error: 'This food is already claimed' });
        }
        const result = await db.query(
            'UPDATE food_items SET status = $1, claimed_by = $2, claimed_by_name = $3, claimed_at = NOW() WHERE id = $4 RETURNING *',
            ['claimed', ngo_id, ngo_name, req.params.id]
        );
        res.json({ success: true, food: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to claim food', details: err.message });
    }
});

// Get bookings for an NGO
app.get('/api/bookings/:ngoId', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM food_items WHERE claimed_by = $1 ORDER BY claimed_at DESC',
            [req.params.ngoId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Mark food as picked up / completed
app.patch('/api/food/:id/complete', async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE food_items SET status = $1 WHERE id = $2 RETURNING *',
            ['completed', req.params.id]
        );
        if (result.rows.length > 0) {
            res.json({ success: true, food: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Food listing not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to complete' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
