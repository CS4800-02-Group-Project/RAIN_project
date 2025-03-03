const express = require('express');
const app = express();

// Define a port number
const PORT = 3000;

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

