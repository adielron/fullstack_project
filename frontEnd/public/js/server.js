const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html from the "views" directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'login.html'));
});

// Serve login.html from the "views" directory
// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../views', 'login.html'));
// });

app.get('/item', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views', 'item.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Frontend server is running at http://localhost:${port}`);
});
