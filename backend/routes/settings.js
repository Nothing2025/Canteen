const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getDeadline, setDeadline } = require('../controllers/settingsController');

router.get('/deadline', auth, getDeadline);
router.put('/deadline', auth, authorize('admin'), setDeadline);

module.exports = router;
