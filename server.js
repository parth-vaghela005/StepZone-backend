const express = require('express'); // Import Express
const app = express();              // Create an Express application
const port = 3000;                  // Define the port the server will run on

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');        // Send a response when someone visits the root URL
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
