// routes/auth.js
const express = require('express');
const passport = require('passport');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        // Create the customer
        await customerController.createCustomer(req, res);

        // Authenticate the customer after successful creation
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                // User not authenticated, handle accordingly
                console.log("res.status(401).json({ message: 'Authentication failed' });");
                return 
            }
            // If authentication successful, log the user in
       
            req.logIn(user, (err) => {
      
                if (err) {
                    return next(err);
                }
                // User logged in successfully
                console.log(".json({ message: 'User created and authenticated successfully' })");
                return res.status(201);
            });
        })(req, res, next);
    } catch (error) {
        // Handle errors if any
        console.error(error);

        if (!res.headersSent) { // Check if headers have been sent
            res.status(500).json({ message: 'Failed to create user' });
        }
    }
});





router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful' });
});

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json({ message: 'Logout successful' });
      //   res.redirect('/');
    });
  });

module.exports = router;
