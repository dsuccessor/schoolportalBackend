const feeListControl = require('../controls/feeListControl')
const express = require('express')
const router = express.Router()

router.post('/feeconfiguration', feeListControl.configureFee)

router.get(
  '/getfeeconfiguration/:feeCategory/:session',
  feeListControl.getConfiguredFee,
)

module.exports = router
