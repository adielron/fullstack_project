const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String }, // Marking position as optional
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }] // Reference to the Purchase model

});

module.exports = mongoose.model('Manager', managerSchema);
