// routes/managerRoutes.js

const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

// Routes for managers
router.get('/purchases/:id', managerController.getPurchaseById); // Get purchase by ID

router.put('/purchases/:id', managerController.updatePurchaseById); // Update purchase by ID
router.delete('/purchases/:id', managerController.deletePurchaseById); // Delete purchase by ID

router.get('/purchases', managerController.getAllPurchasesByManager); // Get all purchases for a manager

router.get('/:email', managerController.getManagerByEmail); // Get manager by email

router.get('/', managerController.getAllManagers);
router.post('/', managerController.createManager);
router.put('/:email', managerController.updateManager); // Update manager by email
router.delete('/:email', managerController.deleteManager); // Delete manager by email

module.exports = router;
