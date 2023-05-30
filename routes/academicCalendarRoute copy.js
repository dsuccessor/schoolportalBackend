const academicCalendarControl = require('../controls/academicCalendarControl')
const express = require('express')
const router = express.Router()

router.post('/configure', academicCalendarControl.createCalendar)
router.get(
  '/fetchconfiguration/:studentId/:matricNo',
  academicCalendarControl.getCalendar,
)
router.delete(
  '/deleteconfiguration/:studentId/:matricNo',
  academicCalendarControl.deleteCalendar,
)
router.put(
  '/updateconfiguration/:studentId/:matricNo',
  academicCalendarControl.updateCalendar,
)

module.exports = router
