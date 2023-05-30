const courseControl = require('../controls/courseControl')
const express = require('express')
const router = express.Router()

router.post('/register', courseControl.createCourse)
router.get('/fetchAll', courseControl.fetchAllCourse)
router.get('/fetchCourseForm', courseControl.courseForm)
router.get('/fetch/:department', courseControl.fetchCourse)
router.put('/update/:courseCode', courseControl.updateCourse)
router.delete('/delete/:courseCode', courseControl.delCourse)


module.exports = router