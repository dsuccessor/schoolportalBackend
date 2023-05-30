const mongoose = require('mongoose')

const walletHistorySchema = new mongoose.Schema(
  {
    walletId: {
      type: Number,
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'payment',
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
    },
    paymentRef: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ['credit', 'debit'],
    },
    txnType: {
      type: String,
      required: true,
      enum: [
        'school fee',
        'acceptance fee',
        'admin fee',
        'other fee',
        'wallet funding',
      ],
    },
    balanceBefore: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    walletBalance: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const walletHistoryModel = mongoose.model('wallethistory', walletHistorySchema)

module.exports = walletHistoryModel
