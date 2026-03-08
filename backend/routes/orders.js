const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { placeOrder, getMyOrders, cancelOrder, getAdminAnalytics } = require('../controllers/orderController');
const { body } = require('express-validator');

// Admin: analytics (must be before /:id)
router.get('/analytics', auth, authorize('admin'), getAdminAnalytics);

// Student: place order
router.post(
    '/',
    auth,
    authorize('student'),
    [
        body('pickup_slot').notEmpty().withMessage('Pickup slot required'),
        body('items').isArray({ min: 1 }).withMessage('Items required'),
    ],
    placeOrder
);

// Student: my orders
router.get('/', auth, authorize('student'), getMyOrders);

// Student: cancel order
router.delete('/:id', auth, authorize('student'), cancelOrder);

module.exports = router;
