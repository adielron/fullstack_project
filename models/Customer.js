// models/Worker.js

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String }, // Marking position as optional
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }] // Reference to the Purchase model


});

// // Method to validate password
// customerSchema.methods.isValidPassword = function(password) {
//   // Compare the provided password with the password stored in the database
//   console.log("passwords");
//   console.log(password);
//   console.log(this.password);

//   return password === this.password;
// };


module.exports = mongoose.model('customer', customerSchema);
