const db = require('../config/db');

// GET /api/settings/deadline
const getDeadline = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT order_deadline FROM settings LIMIT 1');
        const deadline = rows.length > 0 ? rows[0].order_deadline : '10:00';
        res.json({ order_deadline: deadline });
    } catch (err) {
        next(err);
    }
};

// PUT /api/settings/deadline (admin)
const setDeadline = async (req, res, next) => {
    try {
        const { order_deadline } = req.body;
        if (!order_deadline || !/^\d{2}:\d{2}$/.test(order_deadline)) {
            return res.status(400).json({ message: 'Invalid deadline format. Use HH:MM' });
        }

        const [rows] = await db.query('SELECT id FROM settings LIMIT 1');
        if (rows.length > 0) {
            await db.query('UPDATE settings SET order_deadline = ? WHERE id = ?', [order_deadline, rows[0].id]);
        } else {
            await db.query('INSERT INTO settings (order_deadline) VALUES (?)', [order_deadline]);
        }

        res.json({ message: 'Deadline updated', order_deadline });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDeadline, setDeadline };
