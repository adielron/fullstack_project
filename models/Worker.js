const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },

});

module.exports = mongoose.model('Worker', workerSchema);
