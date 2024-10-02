// upload.js
const multer = require('multer');

// Use memory storage to keep files in memory as Buffer objects
const storage = multer.memoryStorage();

// Define the upload middleware
const upload = multer({ storage });

module.exports = upload;
