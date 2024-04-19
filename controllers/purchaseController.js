const Purchase = require('../models/Purchase');
const Customer = require('../models/Customer');
const Item = require('../models/Item');

// Controller function for creating a new purchase
exports.createPurchase = async (req, res) => {
    try {
        const { customerId, itemId } = req.body;

        // Validate input data (optional)
        if (!customerId || !itemId) {
            return res.status(400).json({ message: "Customer ID and Item ID are required" });
        }

        // Create a new purchase instance
        const purchase = new Purchase({
            customerId: customerId,
            itemId: itemId
        });

        // Save the purchase to the database
        await purchase.save();

        await Customer.findByIdAndUpdate(customerId, { $push: { purchases: purchase._id } });

    // Update the purchases array of the associated item
    await Item.findByIdAndUpdate(itemId, { $push: { purchases: purchase._id } });

        // Respond with the created purchase object
        res.status(201).json(purchase);
    } catch (error) {
        console.error("Error creating purchase:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Function to get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    // Fetch all purchases from the database
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
