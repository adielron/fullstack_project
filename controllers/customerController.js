// controllers/customerController.js

const Customer = require('../models/Customer');

// Controller actions for customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get manager by username or email
exports.findCustomerByUsernameOrEmail = async (req, res) => {
  try {
    const { username, email } = req.body;
    console.log(username, email);
    const customer = await Customer.findOne({ $or: [{ username }, { email }] });
    if (customer) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get customer by email
exports.getCustomerByEmail = async (req, res) => {

    try {
      const { email } = req.query;
      console.log(email);
      const customer = await Customer.findOne({ username });
  
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(customer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Create customer
exports.createCustomer = async (req, res) => {
console.log("create customer");
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json({message:"created user"})
  } catch (err) {
    res.status(400).json({ message: err.message });
    // console.log("error");

  }
};

exports.updateCustomer = async (req, res) => {
    try {
      const  email  = req.params.email; // Assuming email is sent in the request body\
      console.log(email);
      const updatedCustomer = await Customer.findOneAndUpdate({ email }, req.body, { new: true });
      if (!updatedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(updatedCustomer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.deleteCustomer = async (req, res) => {
    try {
      const  email  = req.params.email; // Assuming email is sent in the request body\
      const deletedCustomer = await Customer.findOneAndDelete({ email });
      if (!deletedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.getCustomerByEmailReg = async (email) => {
    try {
      const customer = await Customer.findOne({ email });
  
      if (!customer) {
        throw new Error('Customer not found');
      }
  
      return customer;
    } catch (err) {
      throw new Error(err.message);
    }
  };
