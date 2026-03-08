const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
    getMenu, getAllMenu, createItem, updateItem, deleteItem, toggleActive
} = require('../controllers/menuController');
const { body } = require('express-validator');

const menuValidators = [
    body('item_name').trim().notEmpty().withMessage('Item name required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
    body('available_quantity').isInt({ min: 0 }).withMessage('Valid quantity required'),
];

// Student: today's active menu
router.get('/', auth, getMenu);

// Admin: all menu items
router.get('/all', auth, authorize('admin'), getAllMenu);

// Admin: create
router.post('/', auth, authorize('admin'), menuValidators, createItem);

// Admin: update
router.put('/:id', auth, authorize('admin'), updateItem);

// Admin: delete
router.delete('/:id', auth, authorize('admin'), deleteItem);

// Admin: toggle active
router.patch('/:id/toggle', auth, authorize('admin'), toggleActive);

module.exports = router;
