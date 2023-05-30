const {
  paymentNotification,
  paymentConfirmationRequest,
  adminPaymentRequestHistory,
  paymentConfirmation,
  paymentNotificationHistory,
  userFetchWalletHistory,
  searchFetchPayNotification,
  delPayNotification,
} = require('../controls/paymentControl')
const express = require('express')
const router = express.Router()

// Already implemented for admin
router.get('/confirmationrequest', paymentConfirmationRequest)

// Already implemented for admin
router.put('/confirmpayment/:paymentId', paymentConfirmation)

// Already implemented for user
router.post('/sendnotification', paymentNotification)

// Already implemented for user
router.get('/history/:studentId', paymentNotificationHistory)

router.get('/userwallethistory/:studentId', userFetchWalletHistory)
router.get('/search/:paymentId', searchFetchPayNotification)
router.delete('/delete/:paymentId', delPayNotification)

module.exports = router

// const { upload, uploadImage } = require('../controls/fileUpload')
// const docUpload = require('../controls/docUpload')
// router.get('/adminfetchallpaynotification', adminUserFetchPayment)
// router.post('/uploaddoc', docUpload)
// router.post('/upload', uploadImage, upload)
// router.get('/adminfetch', adminPaymentConfirmationRequest)
