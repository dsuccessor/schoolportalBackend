const academicCalendarControl = require('../controls/academicCalendarControl')
const express = require('express')
const router = express.Router()

router.post('/configure', academicCalendarControl.createCalendar)

router.get('/fetchconfiguration', academicCalendarControl.getCalendar)

router.delete(
  '/deleteconfiguration/:id',
  academicCalendarControl.deleteCalendar,
)

router.get(
  '/getcurrentcalendar/:status',
  academicCalendarControl.getCalendarByStatus,
)

router.put('/updateconfiguration/:id', academicCalendarControl.updateCalendar)

module.exports = router
