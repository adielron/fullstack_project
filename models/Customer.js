// models/Worker.js

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  position: { type: String }, // Marking position as optional
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }] // Reference to the Purchase model


});


module.exports = mongoose.model('customer', customerSchema);
