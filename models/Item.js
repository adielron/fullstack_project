// models/Item.js

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({ 
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  weight: { type: String }, 
  madeIn: { type: String },
  color: { type: String },  
  distributor: { type: String }, 
  quality: { type: String }, 
  img: { type: String },
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }]
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
