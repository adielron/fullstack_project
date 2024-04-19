// routes/customerRoutes.js

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Routes for customers
router.get('/', customerController.getAllCustomers);
router.get('/one', customerController.getCustomerByEmail);
router.post('/', customerController.createCustomer);
router.put('/:email', customerController.updateCustomer);
router.delete('/:email', customerController.deleteCustomer);

module.exports = router;
