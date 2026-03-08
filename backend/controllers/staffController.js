const db = require('../config/db');

// GET /api/staff/orders — all non-cancelled orders
const getAllOrders = async (req, res, next) => {
    try {
        const { slot } = req.query;
        let query = `
      SELECT o.id, o.pickup_slot, o.status, o.total_amount, o.created_at,
        u.name AS student_name,
        JSON_ARRAYAGG(JSON_OBJECT(
          'item_name', m.item_name,
          'quantity', oi.quantity,
          'subtotal', oi.subtotal
        )) AS items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menu m ON oi.menu_id = m.id
      WHERE o.status != 'cancelled'
    `;
        const params = [];

        if (slot) {
            query += ' AND o.pickup_slot = ?';
            params.push(slot);
        }

        query += ' GROUP BY o.id ORDER BY o.created_at ASC';

        const [orders] = await db.query(query, params);
        const result = orders.map(o => ({ ...o, items: JSON.parse(o.items || '[]') }));
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/staff/orders/pending — pending orders only
const getPendingOrders = async (req, res, next) => {
    try {
        const { slot } = req.query;
        let query = `
      SELECT o.id, o.pickup_slot, o.status, o.total_amount, o.created_at,
        u.name AS student_name,
        JSON_ARRAYAGG(JSON_OBJECT(
          'item_name', m.item_name,
          'quantity', oi.quantity,
          'subtotal', oi.subtotal
        )) AS items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menu m ON oi.menu_id = m.id
      WHERE o.status = 'pending'
    `;
        const params = [];

        if (slot) {
            query += ' AND o.pickup_slot = ?';
            params.push(slot);
        }

        query += ' GROUP BY o.id ORDER BY o.created_at ASC';
        const [orders] = await db.query(query, params);
        const result = orders.map(o => ({ ...o, items: JSON.parse(o.items || '[]') }));
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/staff/orders/:id — update status
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['ready', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "ready" or "completed"' });
        }

        const [orders] = await db.query("SELECT * FROM orders WHERE id = ? AND status != 'cancelled'", [id]);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Order marked as ${status}` });
    } catch (err) {
        next(err);
    }
};

// GET /api/staff/slots — distinct pickup slots
const getSlots = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            "SELECT DISTINCT pickup_slot FROM orders WHERE status != 'cancelled' AND DATE(created_at) = CURDATE() ORDER BY pickup_slot"
        );
        res.json(rows.map(r => r.pickup_slot));
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllOrders, getPendingOrders, updateOrderStatus, getSlots };
