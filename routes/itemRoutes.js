// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Middleware function to check if the user is a worker
function checkWorkerRole(req, res, next) {
    console.log('cheching role for creating item'+req.user.role);
    // Check if the user is authenticated and has the role of "worker"
    console.log(req.isAuthenticated());
    if (req.isAuthenticated() && req.user.role == 'manager' ) {
        // If the user is a worker, proceed to the next middleware/route handler
        console.log('next');
        next();
    } else {
        // If the user is not a worker, deny access with a 403 Forbidden error

        res.status(403).json({ message: 'Unauthorized' });
    }
}

// Routes for items
router.get('/', itemController.getAllItems); // Public route: Get all items
router.get('/search', itemController.getItemsByQuery); // Public route: Get items by search
router.get('/category', itemController.getItemsByCategory); // Public route: Get all items
router.get('/criteria', itemController.getItemsByCriteria); // Public route: Get items by criteria
router.get('/group-by-dynamic', itemController.groupItemsByDynamicCriteria); // Public route: Group items by dynamic criteria
router.get('/price-and-quality', itemController.getItemsByPriceAndQuality); // Public route: Get items by price and quality
router.get('/:id', itemController.getItemById); // Public route: Get item by ID

// Protected routes (accessible only by workers)
router.post('/', checkWorkerRole, itemController.createItem); // Protected route: Create item
router.put('/:id', checkWorkerRole, itemController.updateItem); // Protected route: Update item
router.delete('/:id', checkWorkerRole, itemController.deleteItem); // Protected route: Delete item

// Custom routes

module.exports = router;
