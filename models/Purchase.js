const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    date: { type: Date, default: Date.now } // Adding date field with default value set to current date
});


module.exports = mongoose.model('Purchase', purchaseSchema);
