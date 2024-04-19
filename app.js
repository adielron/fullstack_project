// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const itemRoutes = require('./routes/itemRoutes');
const customerRoutes = require('./routes/customerRoutes');
const workerRoutes = require('./routes/workerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/items', itemRoutes);
app.use('/customers', customerRoutes);
app.use('/workers', workerRoutes);
app.use('/purchases', purchaseRoutes);

const uri = 'mongodb+srv://adielron:5WZgfuzAosHYdqep@cluster0.gfkrzlb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
