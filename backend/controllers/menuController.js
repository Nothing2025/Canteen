const db = require('../config/db');
const { validationResult } = require('express-validator');

// GET /api/menu — today's active items (student)
const getMenu = async (req, res, next) => {
    try {
        const [items] = await db.query(
            "SELECT * FROM menu WHERE is_active = 1 AND date = CURDATE() ORDER BY item_name"
        );
        res.json(items);
    } catch (err) {
        next(err);
    }
};

// GET /api/menu/all — all items (admin)
const getAllMenu = async (req, res, next) => {
    try {
        const [items] = await db.query(
            "SELECT * FROM menu ORDER BY date DESC, item_name"
        );
        res.json(items);
    } catch (err) {
        next(err);
    }
};

// POST /api/menu — create item (admin)
const createItem = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { item_name, price, available_quantity, date } = req.body;
        const itemDate = date || new Date().toISOString().split('T')[0];

        const [result] = await db.query(
            'INSERT INTO menu (item_name, price, available_quantity, is_active, date) VALUES (?, ?, ?, 1, ?)',
            [item_name, price, available_quantity, itemDate]
        );

        const [newItem] = await db.query('SELECT * FROM menu WHERE id = ?', [result.insertId]);
        res.status(201).json({ message: 'Menu item created', item: newItem[0] });
    } catch (err) {
        next(err);
    }
};

// PUT /api/menu/:id — update item (admin)
const updateItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { item_name, price, available_quantity, date } = req.body;

        const [existing] = await db.query('SELECT id FROM menu WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Item not found' });

        await db.query(
            'UPDATE menu SET item_name = ?, price = ?, available_quantity = ?, date = ? WHERE id = ?',
            [item_name, price, available_quantity, date, id]
        );

        const [updated] = await db.query('SELECT * FROM menu WHERE id = ?', [id]);
        res.json({ message: 'Item updated', item: updated[0] });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/menu/:id — delete item (admin)
const deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT id FROM menu WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Item not found' });

        await db.query('DELETE FROM menu WHERE id = ?', [id]);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/menu/:id/toggle — toggle active (admin)
const toggleActive = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM menu WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Item not found' });

        const newStatus = existing[0].is_active ? 0 : 1;
        await db.query('UPDATE menu SET is_active = ? WHERE id = ?', [newStatus, id]);
        res.json({ message: `Item ${newStatus ? 'activated' : 'deactivated'}`, is_active: newStatus });
    } catch (err) {
        next(err);
    }
};

module.exports = { getMenu, getAllMenu, createItem, updateItem, deleteItem, toggleActive };
