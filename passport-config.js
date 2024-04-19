const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Customer = require('./controllers/customerController'); 

// Configure the local strategy for authenticating customers
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Assuming email is used for login
    async (email, password, done) => {
        try {
            const customer = await Customer.getCustomerByEmailReg( email);

            if (!customer) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            if (password != customer.password) {

                return done(null, false, { message: 'Incorrect password.' });
            }

            // now to authinticate user what to do 
            // console.log(customer);
            return done(null, customer);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize and deserialize customer for session management
passport.serializeUser((customer, done) => {
    done(null, customer.email);
});

passport.deserializeUser((email, done) => {
    console.log("Deserializing user with ID:", id);
    Customer.getCustomerByEmail(email, (err, customer) => {
        done(err, customer);
    });
});

module.exports = passport;
