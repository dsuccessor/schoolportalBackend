const adminControl = require('../controls/adminControl')
const express = require('express')
const router = express.Router()

router.post('/register', adminControl.createAdmin)
router.get('/fetchAll', adminControl.fetchAllAdmin)
router.get('/fetch', adminControl.fetchAdmin)
router.put('/update/:email', adminControl.updateAdmin)
router.delete('/delete/:email', adminControl.delAdmin)


module.exports = router