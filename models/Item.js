// models/Item.js

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  weight: { type: String }, // Adding weight field
  madeIn: { type: String }, // Adding madeIn field
  color: { type: String },   // Adding color field
  distributor: { type: String }, // Adding distributor field
  quality: { type: String }, // Adding quality field
  img: { type: String }, // Adding quality field
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }] // Reference to the Purchase model

});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
