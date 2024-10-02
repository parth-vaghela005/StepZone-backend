const express = require('express'); // Import Express
const app = express();              // Create an Express application                // Define the port the server will run on
const dotenv = require('dotenv');
const cors = require('cors');
const {router }= require('./Routers/Userroute.js')
const mongoose = require('mongoose')
dotenv.config();
const PORT  = process.env.PORT || 8000;
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(cors());
const mongoURI = process.env.MONGO_URI; // Use your MongoDB URI from environment variables
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
app.get('/', (req, res) => {
  res.send('Hello, World!');       
});
app.use('/api/v1/auth', router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
