const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getAllOrders, getPendingOrders, updateOrderStatus, getSlots } = require('../controllers/staffController');

// Get all orders (with optional slot filter)
router.get('/orders', auth, authorize('staff', 'admin'), getAllOrders);

// Get pending orders only
router.get('/orders/pending', auth, authorize('staff', 'admin'), getPendingOrders);

// Get distinct pickup slots for today
router.get('/slots', auth, authorize('staff', 'admin'), getSlots);

// Update order status (ready/completed)
router.patch('/orders/:id', auth, authorize('staff', 'admin'), updateOrderStatus);

module.exports = router;
