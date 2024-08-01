// controllers/itemController.js

const Item = require('../models/Item');

// Controller actions for items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get items by query
exports.getItemsByQuery = async (req, res) => {
  const query = req.query.query || '';
  try {
    const items = await Item.find({
      name: { $regex: new RegExp(query, 'i') }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get items by category
exports.getItemsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    let items;
    if (category && category !== 'all') {
      items = await Item.find({ category });
    }
    else {
      items = await Item.find({});
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create item
exports.createItem = async (req, res) => {
  console.log("creating item");
  const newItem = new Item(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  console.log('Attempting to update item with id:', req.params.id);
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  console.log('Attempting to delete item with id:', req.params.id);
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get items by criteria
exports.getItemsByCriteria = async (req, res) => {
  try {
    const { color, madeIn, weight } = req.query;
    const query = {};

    // Add conditions based on provided criteria
    if (color) {
      query.color = color;
    }
    if (madeIn) {
      query.madeIn = madeIn;
    }
    if (weight) {
      query.weight = weight;
    }
    // Find items matching the criteria
    const items = await Item.find(query);

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get items by price and quality
exports.getItemsByPriceAndQuality = async (req, res) => {
  try {
    const { priceFrom, priceTo, quality, distributor } = req.query;
    const query = {};

    // Add conditions based on provided criteria
    if (priceFrom) {
      query.price = { ...query.price, $gte: Number(priceFrom) };
    }
    if (priceTo) {
      query.price = { ...query.price, $lte: Number(priceTo) };
    }
    if (quality) {
      query.quality = quality;
    }
    if (distributor) {
      query.distributor = distributor;
    }

    // Find items matching the criteria
    const items = await Item.find(query);

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Group items by given criteria
exports.groupItemsByDynamicCriteria = async (req, res) => {
  try {
    const { groupBy } = req.query;

    // Validate the requested groupBy field
    if (!groupBy) {
      return res.status(400).json({ message: 'Missing groupBy parameter' });
    }

    // Construct the aggregation pipeline based on the requested groupBy field
    const pipeline = [
      {
        $group: {
          _id: `$${groupBy}`, // Dynamically group by the requested field
          totalItems: { $sum: 1 }, // Count total items in each group
          averagePrice: { $avg: '$price' }, // Calculate average price in each group
        }
      },
      {
        $sort: { _id: 1 } // Sort results by the grouped field
      }
    ];

    const groupedItems = await Item.aggregate(pipeline);

    res.json(groupedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Publish a new item notice on Facebook
const axios = require('axios');
const PAGE_ID = process.env.PAGE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function postToFacebook(item) {
  const MESSAGE = "New item in our store: " + item.name;
  const url = `https://graph.facebook.com/v20.0/${PAGE_ID}/photos?message=${MESSAGE}&&access_token=${ACCESS_TOKEN}`;

  const data = {
    "url": item.img
  };

  try {
    const response = await axios.post(url, data);
    console.log('Post ID:', response.data.id);
  } catch (error) {
    console.error('Error posting on Facebook:', error.response ? error.response.data : error.message);
  }
};