const loginControl = require('../controls/loginControl')
const express = require('express')
const loginUser = require('../controls/loginControl')
const router = express.Router()

router.post('/Login', loginControl)


module.exports = router