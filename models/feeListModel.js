const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(mongoose.connection)

const feeListSchema = new mongoose.Schema(
  {
    gradeId: {
      type: Number,
      required: true,
    },
    feeCategory: {
      type: String,
      required: true,
      lowercase: true,
    },
    session: {
      type: String,
      required: true,
      lowercase: true,
    },
    dueFees: [
      {
        feeName: {
          type: String,
          required: true,
          lowercase: true,
          enum: ['school fee', 'acceptance fee', 'admin fee', 'other fee'],
          unique: true,
        },
        amount: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

feeListSchema.plugin(autoIncrement.plugin, {
  model: 'paymentAdvice',
  field: 'gradeId',
  startAt: 404001,
  incrementBy: 37,
})

const feeListModel = mongoose.model('paymentAdvice', feeListSchema)

module.exports = feeListModel
