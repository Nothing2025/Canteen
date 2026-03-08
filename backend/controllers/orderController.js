const db = require('../config/db');
const { validationResult } = require('express-validator');

// Helper: get order deadline from settings
const getDeadlineTime = async () => {
    const [rows] = await db.query('SELECT order_deadline FROM settings LIMIT 1');
    return rows.length > 0 ? rows[0].order_deadline : '10:00';
};

// Helper: check if ordering is still allowed
const isBeforeDeadline = (deadline) => {
    const now = new Date();
    const [hours, minutes] = deadline.split(':').map(Number);
    const deadlineTime = new Date();
    deadlineTime.setHours(hours, minutes, 0, 0);
    return now < deadlineTime;
};

// POST /api/orders — place order (student)
const placeOrder = async (req, res, next) => {
    const conn = await db.getConnection();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        // Check deadline
        const deadline = await getDeadlineTime();
        if (!isBeforeDeadline(deadline)) {
            return res.status(400).json({ message: `Order deadline (${deadline}) has passed for today` });
        }

        const { pickup_slot, items } = req.body;
        // items: [{ menu_id, quantity }]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        await conn.beginTransaction();

        let total_amount = 0;
        const orderItems = [];

        for (const item of items) {
            const [menuRows] = await conn.query(
                'SELECT * FROM menu WHERE id = ? AND is_active = 1 AND date = CURDATE() FOR UPDATE',
                [item.menu_id]
            );

            if (menuRows.length === 0) {
                await conn.rollback();
                return res.status(400).json({ message: `Menu item ${item.menu_id} not available` });
            }

            const menuItem = menuRows[0];
            if (menuItem.available_quantity < item.quantity) {
                await conn.rollback();
                return res.status(400).json({
                    message: `Insufficient stock for "${menuItem.item_name}". Only ${menuItem.available_quantity} left.`
                });
            }

            const subtotal = parseFloat(menuItem.price) * item.quantity;
            total_amount += subtotal;
            orderItems.push({ menu_id: item.menu_id, quantity: item.quantity, subtotal });

            // Deduct quantity
            await conn.query(
                'UPDATE menu SET available_quantity = available_quantity - ? WHERE id = ?',
                [item.quantity, item.menu_id]
            );
        }

        // Create order
        const [orderResult] = await conn.query(
            'INSERT INTO orders (user_id, total_amount, pickup_slot, status) VALUES (?, ?, ?, ?)',
            [req.user.id, total_amount, pickup_slot, 'pending']
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const oi of orderItems) {
            await conn.query(
                'INSERT INTO order_items (order_id, menu_id, quantity, subtotal) VALUES (?, ?, ?, ?)',
                [orderId, oi.menu_id, oi.quantity, oi.subtotal]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'Order placed successfully', order_id: orderId, total_amount });
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        conn.release();
    }
};

// GET /api/orders — get student's own orders
const getMyOrders = async (req, res, next) => {
    try {
        const [orders] = await db.query(
            `SELECT o.id, o.total_amount, o.pickup_slot, o.status, o.created_at,
        JSON_ARRAYAGG(JSON_OBJECT(
          'item_name', m.item_name,
          'quantity', oi.quantity,
          'subtotal', oi.subtotal,
          'price', m.price
        )) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN menu m ON oi.menu_id = m.id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
            [req.user.id]
        );
        // Parse items JSON
        const result = orders.map(o => ({ ...o, items: JSON.parse(o.items || '[]') }));
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/orders/:id — cancel order (student)
const cancelOrder = async (req, res, next) => {
    const conn = await db.getConnection();
    try {
        const { id } = req.params;
        const [orders] = await conn.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (orders.length === 0) {
            conn.release();
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];
        if (order.status !== 'pending') {
            conn.release();
            return res.status(400).json({ message: 'Only pending orders can be cancelled' });
        }

        // Check deadline before cancelling
        const deadline = await getDeadlineTime();
        if (!isBeforeDeadline(deadline)) {
            conn.release();
            return res.status(400).json({ message: 'Cancellation deadline has passed' });
        }

        await conn.beginTransaction();

        // Restore quantities
        const [items] = await conn.query(
            'SELECT menu_id, quantity FROM order_items WHERE order_id = ?', [id]
        );
        for (const item of items) {
            await conn.query(
                'UPDATE menu SET available_quantity = available_quantity + ? WHERE id = ?',
                [item.quantity, item.menu_id]
            );
        }

        await conn.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [id]);
        await conn.commit();
        res.json({ message: 'Order cancelled successfully' });
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        conn.release();
    }
};

// GET /api/orders/analytics — admin analytics
const getAdminAnalytics = async (req, res, next) => {
    try {
        // Total revenue (completed/ready orders)
        const [revenueRows] = await db.query(
            "SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE status IN ('completed', 'ready')"
        );

        // Total orders today
        const [todayRows] = await db.query(
            "SELECT COUNT(*) AS total_daily_orders FROM orders WHERE DATE(created_at) = CURDATE()"
        );

        // Most ordered item (today)
        const [topItemRows] = await db.query(
            `SELECT m.item_name, SUM(oi.quantity) AS total_qty
       FROM order_items oi
       JOIN menu m ON oi.menu_id = m.id
       JOIN orders o ON oi.order_id = o.id
       WHERE DATE(o.created_at) = CURDATE() AND o.status != 'cancelled'
       GROUP BY m.id
       ORDER BY total_qty DESC
       LIMIT 1`
        );

        // Daily revenue for last 7 days
        const [dailyRevenue] = await db.query(
            `SELECT DATE(created_at) AS date, SUM(total_amount) AS revenue
       FROM orders
       WHERE status IN ('completed','ready') AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
        );

        // Top 5 items by quantity
        const [topItems] = await db.query(
            `SELECT m.item_name, SUM(oi.quantity) AS total_qty
       FROM order_items oi
       JOIN menu m ON oi.menu_id = m.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status != 'cancelled'
       GROUP BY m.id
       ORDER BY total_qty DESC
       LIMIT 5`
        );

        res.json({
            total_revenue: revenueRows[0].total_revenue,
            total_daily_orders: todayRows[0].total_daily_orders,
            most_ordered: topItemRows[0] || null,
            daily_revenue: dailyRevenue,
            top_items: topItems,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { placeOrder, getMyOrders, cancelOrder, getAdminAnalytics };
