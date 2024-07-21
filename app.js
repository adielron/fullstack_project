// app.js

const express = require('express');


//passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieSession = require('cookie-session');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');


const app = express();

app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true // This allows cookies to be sent with the request
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded


app.use(cookieSession({
  name: 'app-auth',
  keys: ['secret new','secret-old'],
  maxAge: 60 * 60 * 24,
  sameSite: 'strict' // Set the sameSite attribute
}));


app.use(bodyParser.json()) // parse application/json
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>{
  return done(null,user._id)
});


passport.deserializeUser((id,done)=> {
console.log('deserializeUser');
// Usage example
findDocumentByID(id)
    .then(user => {
        if (user) {
            return done(null,user)
        } else {
            console.log('user not found.');
            return(null,err);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return(null,err);
    });
});


passport.use('local', new LocalStrategy( {passReqToCallback:true},
   (req,username, password, done) => {

// Usage example
  const nameDb = username;
  const passwordDb = password;

  searchAllCollections(nameDb, passwordDb)
    .then(result => {
        return done(null,result)
    })
    .catch(error => {
        console.error('Error searching in db for strategy:', error);
        return done(null, error);
    });

    
  }));


//rioutes
const itemRoutes = require('./routes/itemRoutes');
const customerRoutes = require('./routes/customerRoutes');
const managersRoutes = require('./routes/managerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const authRouter = require('./routes/auth');


// Routes
app.use('/items', itemRoutes);
app.use('/customers', customerRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/managers', managersRoutes);
app.use('/auth', authRouter);


const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://adielron:${password}@cluster0.gfkrzlb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Connect to MongoDB-start port 
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));



// Function to search for a match across all collections-strategy
async function searchAllCollections(username, password) {
  try {
      const collections = await mongoose.connection.db.collections();
      for (let collection of collections) {
          // Skip system collections
          if (collection.collectionName.startsWith('system.')) {
              continue;
          }
          // Retrieve the first matching document from the collection
          const doc = await collection.findOne({ username, password });
          if (doc) {
              return doc; // Return the first matching document
          }
      }
      return null; // No match found
  } catch (error) {
      console.error('Error searching collections:', error);
      throw error;
  }
}

// Function to search for a document by ID across all collections - deserilize
async function findDocumentByID(id) {
  try {
      // Iterate over all registered models in Mongoose
      for (const modelName of Object.keys(mongoose.models)) {
          const Model = mongoose.model(modelName);
          // Use the findById method of each model to search for the document by ID
          const document = await Model.findById(id);
          // If a document is found, return it
          if (document) {
              return document;
          }
      }
      // If no document is found in any collection, return null
      return null;
  } catch (error) {
      // If an error occurs during the search, throw it
      throw error;
  }
}