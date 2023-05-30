const mongoose = require('mongoose')

const schoolDuesSchema = new mongoose.Schema(
  {
    feeId: {
      type: 'string',
      required: true,
      unique: true,
    },
    studentId: {
      type: Number,
      required: true,
    },
    matricNo: {
      type: Number,
      required: true,
    },
    session: {
      type: String,
      required: true,
      lowercase: true,
    },
    semester: {
      type: String,
      required: true,
      lowercase: true,
    },
    level: {
      type: String,
      required: true,
      lowercase: true,
    },
    feeName: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['school fee', 'acceptance fee', 'admin fee', 'other fee'],
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    paymentRef: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['paid', 'pending'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
)

const schoolDuesModel = mongoose.model('schooldues', schoolDuesSchema)

module.exports = schoolDuesModel
