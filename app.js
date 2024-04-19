// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./passport-config'); // Adjust the path as needed

const session = require('express-session');


const itemRoutes = require('./routes/itemRoutes');
const customerRoutes = require('./routes/customerRoutes');
const managersRoutes = require('./routes/managerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const authRouter = require('./routes/auth');

const app = express();


// Middleware
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret', // Change this to a random string
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use('/items', itemRoutes);
app.use('/customers', customerRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/managers', managersRoutes);

app.use('/auth', authRouter);

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
