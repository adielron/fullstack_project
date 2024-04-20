// controllers/workerController.js

const Manager = require('../models/Manager');
const purchaseController = require('../controllers/purchaseController');


// Function in manager controller to get all purchases
exports.getAllPurchasesByManager = async (req, res) => {
  console.log("hello");

  try {
    // Call the function from the purchases controller to get all purchases
    const purchases = await purchaseController.getAllPurchases(req, res);
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller actions for managers
exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getManagerByEmail = async (req, res) => {
  try {
    const email  = req.params.email;
    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createManager = async (req, res) => {
  const newManager = new Manager(req.body);
  try {
    const savedManager = await newManager.save();
    res.status(201);
  } catch (err) {
    res.status(400)
    console.log(err.message);
  }
};

exports.updateManager = async (req, res) => {
  try {
    const email  = req.params.email;
    const updatedManager = await Manager.findOneAndUpdate({ email }, req.body, { new: true });
    if (!updatedManager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.json(updatedManager);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteManager = async (req, res) => {
  try {
    const email  = req.params.email;
    const deletedManager = await Manager.findOneAndDelete({ email });
    if (!deletedManager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.json({ message: 'Manager deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const Purchase = require('../models/Purchase');

// Get a purchase by ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a purchase by ID
exports.updatePurchaseById = async (req, res) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPurchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json(updatedPurchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a purchase by ID
exports.deletePurchaseById = async (req, res) => {
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!deletedPurchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json({ message: 'Purchase deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};