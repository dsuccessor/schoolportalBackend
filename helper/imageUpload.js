// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  //cloud_name: process.env.CLOUDINARY_USER_NAME,
  cloud_name: "schoolportal",
  //api_key: process.env.CLOUDINARY_API_KEY,
  api_key: "197462131525526",
  //api_secret: process.env.CLOUDINARY_API_SECRET,
  api_secret: "DPO8PipjkotPrG_cO60ZhjDLK_4",
});

// Log the configuration
console.log(cloudinary.config());

module.exports = cloudinary;
