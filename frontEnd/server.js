const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const port = 4000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
dotenv.config({ path: path.join(__dirname, '.env') });

// Routes
const STOCK_KEY = process.env.STOCK_KEY;


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'api.html'));
});

app.get('/branches', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'branches.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/item', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'item.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/myAccount', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'myAccount.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/search_advanced', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search_advanced.html'));
});

app.get('/statistics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'statistics.html'));
});

app.get('/config', (req, res) => {
    console.log("key");

    console.log(STOCK_KEY);
    res.json({ apiKey: STOCK_KEY });
});


app.get('/groupBy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'groupBy.html'));
});

app.get('/purchases', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'purchases.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Frontend server is running at http://localhost:${port}`);
});
