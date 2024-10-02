const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: 719515851437748,  
  api_secret: process.env.API_SECRET
});
module.exports = cloudinary;