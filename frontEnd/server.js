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
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

app.get('/item', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'item.html'));
});

app.get('/maps', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'maps.html'));
});

app.get('/groupBy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'groupBy.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/search_c', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search_c.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'api.html'));
});

app.get('/config', (req, res) => {
    console.log("key");

    console.log(STOCK_KEY);
    res.json({ apiKey: STOCK_KEY });
});


// Start the server
app.listen(port, () => {
    console.log(`Frontend server is running at http://localhost:${port}`);
});
