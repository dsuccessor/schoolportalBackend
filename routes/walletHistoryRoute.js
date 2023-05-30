const walletHistoryControl = require('../controls/walletHistoryControl')
const express = require('express')
const router = express.Router()

// Already connected
router.post('/fundwallet', walletHistoryControl.fundWallet)
// Already connected
router.get('/getwalletbalance/:walletId', walletHistoryControl.walletBalance)
// Already connected
router.get(
  '/studentwallethistory/:walletId',
  walletHistoryControl.studentWalletHistory,
)
// Already connected
router.get('/adminwallethistory', walletHistoryControl.adminWalletHistory)

// Already connected
router.post('/filterwallethistory', walletHistoryControl.filterWalletHistory)

// Already connected
router.post(
  '/filterwallethistoryfordownload',
  walletHistoryControl.filterForDownload,
)

// Already connected
router.get('/aggregateBalance', walletHistoryControl.aggregateBalance)

// Already connected
router.post('/debitwallet', walletHistoryControl.debitWallet)

router.delete('/closewallet/:studentId', walletHistoryControl.delWallet)
// router.put('/fundwallet', walletHistoryControl.fundWallet)

module.exports = router
