const schoolDuesControl = require('../controls/schoolDuesControl')
const express = require('express')
const router = express.Router()

router.post('/paydue', schoolDuesControl.payDue)

router.get('/getduebyref/:paymentref', schoolDuesControl.getDueByRef)

router.get('/getduebyany/:search', schoolDuesControl.getDueByAny)

router.get(
  '/getduesstatus/:matricNo/:session/:semester/:level/:amount/:feeName',
  schoolDuesControl.getDueByMany,
)

router.get('/getduebyFeeId/:feeId', schoolDuesControl.getDueByFeeId)

router.get('/getdues', schoolDuesControl.getAllDue)

module.exports = router
