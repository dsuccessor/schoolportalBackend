const studentControl = require("../controls/studentControl");
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

router.post(
  "/register",
  uploads.single("passport"),
  studentControl.createStudent
);
router.get("/fetchAll", studentControl.fetchAllStudent);
router.get("/fetch/:email", studentControl.fetchStudent);
router.put("/update/:email", studentControl.updateStudent);
router.put("/updatebyid/:id", studentControl.updateById);
router.delete("/delete/:id", studentControl.delStudent);

module.exports = router;

// const studentControl = require('../controls/studentControl')
// const express = require('express')
// const router = express.Router()

// router.post('/register', studentControl.createStudent)
// router.get('/fetchAll', studentControl.fetchAllStudent)
// router.get('/fetch/:email', studentControl.fetchStudent)
// router.put('/update/:email', studentControl.updateStudent)
// router.put('/updatebyid/:id', studentControl.updateById)
// router.delete('/delete/:id', studentControl.delStudent)

// module.exports = router
