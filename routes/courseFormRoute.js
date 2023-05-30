const courseFormControl = require('../controls/courseFormControl')
const express = require('express')
const router = express.Router()

router.post('/registercourse', courseFormControl.createCourseForm)
router.get('/fetchAll/:studentId', courseFormControl.fetchCourseForm)
router.get('/search', courseFormControl.searchCourseForm)
router.put('/update/:courseCode', courseFormControl.updateCourseForm)
router.delete('/delete/:courseCode', courseFormControl.delCourseForm)
router.get('/test', courseFormControl.testCourseForm)

module.exports = router
