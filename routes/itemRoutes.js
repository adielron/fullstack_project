// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Routes for items
router.get('/', itemController.getAllItems);
router.get('/criteria', itemController.getItemsByCriteria);
router.get('/group-by-dynamic', itemController.groupItemsByDynamicCriteria); // New route for dynamic grouping
router.get('/price-and-quality', itemController.getItemsByPriceAndQuality);

router.get('/:id', itemController.getItemById);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem); // Route for updating an item
router.delete('/:id', itemController.deleteItem); // Route for deleting an item

// Custom routes


module.exports = router;
