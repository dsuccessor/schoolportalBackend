const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(mongoose.connection)

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: Number,
      required: true,
      unique: true,
    },
    studentId: {
      type: Number,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
      enum: ['First Bank', 'Access Bank', 'Kuda MFB', 'GT Bank', 'UBA'],
    },
    payeeName: {
      type: String,
      required: true,
      lowercase: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    narration: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    paymentEvidence: {
      type: String,
      required: true,
      lowercase: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    adminConfirmStatus: {
      type: String,
      default: 'pending',
      enum: ['approved', 'declined', 'pending'],
    },
    declineReason: {
      type: String,
      lowercase: true,
      default: '-',
    },
    adminName: {
      type: String,
      lowercase: true,
      default: '-',
    },
  },
  {
    timestamps: true,
  },
)

paymentSchema.plugin(autoIncrement.plugin, {
  model: 'payment',
  field: 'paymentId',
  startAt: 101001,
  incrementBy: 255,
})
const paymentModel = mongoose.model('payment', paymentSchema)

module.exports = paymentModel
