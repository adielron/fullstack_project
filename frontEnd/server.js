const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
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



// Start the server
app.listen(port, () => {
    console.log(`Frontend server is running at http://localhost:${port}`);
});
