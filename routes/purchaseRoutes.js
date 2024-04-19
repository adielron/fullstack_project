const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Route for creating a new purchase
router.post('/', purchaseController.createPurchase);

// Export the router
module.exports = router;
