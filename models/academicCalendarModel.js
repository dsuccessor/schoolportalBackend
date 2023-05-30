const mongoose = require('mongoose')

const academicCalendarSchema = new mongoose.Schema(
  {
    session: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['first semester', 'second semester'],
    },
    status: {
      type: String,
      required: true,
      lowercase: true,
      default: 'inactive',
      enum: ['active', 'inactive'],
    },
  },
  {
    timestamps: true,
  },
)

const academicCalendarModel = mongoose.model(
  'academiccalendar',
  academicCalendarSchema,
)

module.exports = academicCalendarModel
