const { paymentNotification } = require("../controls/paymentUploadControl");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Wrong file format, Make sure you are uploading an image file!", false);
  }
};

const uploads = multer({ storage, fileFilter });

// Already implemented for user
router.post(
  "/sendnotification",
  uploads.single("paymentDetails"),
  paymentNotification
);

module.exports = router;
