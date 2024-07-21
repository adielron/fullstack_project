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

exports.updateItem = async (req, res) => {
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

exports.deleteItem = async (req, res) => {
  try {
    console.log(req.params.id);
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


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

  exports.getItemsByPriceAndQuality = async (req, res) => {
    try {
      const { maxPrice, quality, distributor } = req.query;
      const query = {};
  
      // Add conditions based on provided criteria
      if (maxPrice) {
        query.price = { $lt: maxPrice };
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