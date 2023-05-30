const paymentModel = require('../models/paymentModel')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { MulterError } = require('multer')
global.payId = Math.floor(Math.random() * 100) + 1

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, path.join(__dirname, '../uploads/'))
    cb(null, 'payment evidence')
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    var newPath = `PayEvi-${payId}-${file.originalname}.${ext}`
    cb(null, newPath)
  },
})

const paymentNotification = (req, res) => {
  const isImage = (req, file, cb) => {
    const {
      studentId,
      bankName,
      payeeName,
      amount,
      narration,
      paymentDate,
      fileType,
    } = req.body

    const myExt = fileType?.split('/')[1]

    paymentModel.findOne(
      { $and: [{ narration }, { amount }] },
      (err, result) => {
        if (result !== null && result !== undefined) {
          console.log({
            msg: `Payment with narration ${narration} and amount ${amount} already exists`,
            result,
          })

          res.status(400).json({
            msg: `Payment with narration ${narration} and amount ${amount} already exists`,
          })
        } else {
          paymentModel.create(
            {
              studentId,
              bankName,
              payeeName,
              amount,
              narration,
              paymentEvidence: `PayEvi-${payId}-${studentId}-${paymentDate}-${bankName}.${myExt}`,
              paymentDate,
            },
            (err, result) => {
              if (err) {
                console.log({
                  msg: 'Unable to send Payment Notification, Kindly retry',
                  err,
                })

                res.status(400).json({
                  msg: 'Unable to send Payment Notification, Kindly retry',
                })
              } else {
                if (file.mimetype.startsWith('image')) {
                  cb(null, true)
                } else {
                  console.log({
                    msg: `Wrong file uploaded, Make sure the file uploaded is an image file`,
                  })

                  res.status(400).json({
                    msg: `Wrong file uploaded, Make sure the file uploaded is an image file`,
                  })
                }
              }
            },
          )
        }
      },
    )
  }

  const postUpload = multer({
    dest: 'payment evidence',
    storage: multerConfig,
    fileFilter: isImage,
  }).single('paymentEvidence')

  postUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log({ msg: 'Payment Evidence Upload failed', err })

      res.status(400).json({ msg: 'Payment Evidence Upload failed' })
    } else if (err) {
      console.log({
        msg: 'Unable to send Payment Notification, Kindly retry',
        err,
      })
      res
        .status(400)
        .json({ msg: 'Unable to send Payment Notification, Kindly retry' })
    } else {
      console.log({
        msg: 'Payment Notification sent successfully',
      })

      res.status(200).json({ msg: 'Payment Notification sent successfully' })
    }
  })
}

const paymentConfirmationRequest = async (req, res) => {
  paymentModel.find({ adminConfirmStatus: 'pending' }, (error, response) => {
    if (error) {
      console.log({ msg: 'No Payment Notification found', error })
      res.status(400).json({ msg: 'No Payment Notification found', error })
    } else {
      console.log({ msg: 'Payment Notification fetched ', response })
      res.status(200).json({ msg: 'Payment Notification fetched', response })
    }
  })
}

const adminPaymentRequestHistory = async (req, res) => {
  paymentModel.find({}, (error, response) => {
    if (error) {
      console.log({ msg: 'No Payment Notification found', error })
      res.status(400).json({ msg: 'No Payment Notification found', error })
    } else {
      console.log({ msg: 'Payment Notification fetched ', response })
      res.status(200).json({ msg: 'Payment Notification fetched', response })
    }
  })
}

const paymentConfirmation = async (req, res) => {
  const { paymentId } = req.params
  const { adminConfirmStatus, adminName, declineReason } = req.body
  paymentModel.findOne({ paymentId: paymentId }, (error, result) => {
    if (result === null || result === undefined) {
      console.log({ msg: `No Payment Notification found `, error })
      res.status(400).json({ msg: `No Payment Notification found`, error })
    } else {
      paymentModel.findOneAndUpdate(
        { paymentId: paymentId },
        {
          adminConfirmStatus: adminConfirmStatus,
          adminName: adminName,
          declineReason: declineReason,
        },
        {
          new: true,
          runValidators: true,
        },
        (error, result) => {
          if (error) {
            console.log({
              msg: `Failed to confirm/approve payment`,
              error,
            })
            res.status(400).json({
              msg: `Failed to confirm/approve payment `,
              error,
            })
          } else {
            if (adminConfirmStatus === 'approved') {
              console.log({
                msg: `Payment confirmed successfully`,
                result,
              })
              res.status(200).json({
                msg: `Payment confirmed successfully`,
                result,
              })
            } else {
              console.log({
                msg: `Payment declined successfully`,
                result,
              })
              res.status(200).json({
                msg: `Payment declined successfully`,
                result,
              })
            }
          }
        },
      )
    }
  })
}

const paymentNotificationHistory = async (req, res) => {
  const { studentId } = req.params
  // const { studentId } = req.body
  paymentModel.find({ studentId: studentId }, (error, result) => {
    if (result === null || result === undefined) {
      console.log({ msg: `No Payment Notification found `, error })
      res.status(400).json({ msg: `No Payment Notification found`, error })
    } else {
      console.log({ msg: `Payment Notification fetched `, result })
      res.status(200).json({ msg: `Payment Notification fetched `, result })
    }
  })
}

const userFetchWalletHistory = async (req, res) => {
  const { studentId } = req.params
  paymentModel.find(
    { $and: [{ studentId: studentId }, { adminConfirmStatus: true }] },
    (error, result) => {
      if (result === null || result === undefined) {
        console.log({ msg: `No Payment history found on your wallet`, error })
        res
          .status(400)
          .json({ msg: `No Payment history found on your wallet`, error })
      } else {
        console.log({ msg: `Wallet history fetched `, result })
        res.status(200).json({ msg: `Wallet history fetched `, result })
      }
    },
  )
}

const searchFetchPayNotification = async (req, res) => {
  const { paymentId } = req.params
  paymentModel.findOne({ paymentId: paymentId }, (error, result) => {
    if (result == null) {
      console.log({
        msg: `No Payment Notification found for ${paymentId} `,
        error,
      })
      res
        .status(400)
        .json({ msg: `No Payment Notification found for ${paymentId} `, error })
    } else {
      console.log({
        msg: `Payment Notification fetched for ${paymentId} `,
        result,
      })
      res
        .status(200)
        .json({ msg: `Payment Notification fetched for ${paymentId} `, result })
    }
  })
}

const delPayNotification = async (req, res) => {
  const { paymentId } = req.params
  paymentModel.findOneAndDelete({ paymentId: paymentId }, (error, result) => {
    if (error) {
      console.log({
        msg: `Failed to delete payment notification with ${paymentId} `,
        error,
      })
      res.status(400).json({
        msg: `Failed to delete payment notification with ${paymentId} `,
        error,
      })
    } else {
      console.log({
        msg: `Payment notification found and deleted for ${paymentId} `,
        result,
      })
      res.status(200).json({
        msg: `Payment notification found and deleted for ${paymentId} `,
        result,
      })
    }
  })
}

module.exports = {
  paymentNotification,
  paymentConfirmationRequest,
  adminPaymentRequestHistory,
  paymentConfirmation,
  paymentNotificationHistory,
  userFetchWalletHistory,
  searchFetchPayNotification,
  delPayNotification,
}
