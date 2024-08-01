// routes/auth.js
const express = require('express');
const customerController = require('../controllers/customerController');
const managerController = require('../controllers/managerController');
const passport = require('passport');

const router = express.Router();

// Register new manager profile
router.post('/register/manager', async (req, res, next) => {
    try {
        // Check if username or password already exist
        await managerController.findManagerByUsernameOrEmail(req, res);        
        await customerController.findCustomerByUsernameOrEmail(req, res);
               
        // Create the manager using the managerController
        await managerController.createManager(req, res);        

        // Authenticate the manager after successful creation
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            if (!user) {
                // If authentication failed, handle accordingly
                console.log('user doesnot exist');
                return res.status(401).json({ message: 'Authentication failed' });
            }
            // If authentication successful,    
            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                // User logged in successfully
                return res.status(200).json({ message: 'Manager created and authenticated successfully' });
            });
        })(req, res, next);
    } catch (error) {
        // Handle errors if any
        console.error(error);
        if (!res.headersSent) { // Check if headers have been sent
            res.status(500).json({ message: 'Failed to create manager' });
        }
    }
});

// Register new customer profile
router.post('/register/customer', async (req, res, next) => {
    try {
        // Check if username or password already exist
        await managerController.findManagerByUsernameOrEmail(req, res);        
        await customerController.findCustomerByUsernameOrEmail(req, res);
       
        // Create the customer
        await customerController.createCustomer(req, res);

        // Authenticate the customer after successful creation
        passport.authenticate('local', (err, user,) => {
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
                console.log(user);
                if (err) {
                    return next(err);
                }
                // User logged in successfully
                res.status(200)
                console.log(".json({ message: 'User created and authenticated successfully' })");
                return res.status(201);
            });
        })
            (req, res, next);
    } catch (error) {
        // Handle errors if any
        console.error(error);

        if (!res.headersSent) { // Check if headers have been sent
            res.status(500).json({ message: 'Failed to create user' });
        }
    }
});

router.get('/status', (req, res) => {
    if (req.isAuthenticated() && req.user) {
        res.json({
            isAuthenticated: true,
            user: req.user
        });
        console.log("autherized  ");

    } else {
        res.json({
            isAuthenticated: false
        });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log("logging in ");
    res.status(200).json({ message: 'Login successful' });
});

router.get('/logout', function (req, res, next) {
    console.log("Logging out");
    req.logout(); // Passport's logout function
    console.log(" out");
    res.redirect('/');


    // After logout, redirect to the home page
});

module.exports = router;
