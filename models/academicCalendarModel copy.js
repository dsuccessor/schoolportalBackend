const mongoose = require('mongoose')

const academicCalendarSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      required: true,
      unique: true,
    },
    matricNo: {
      type: Number,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      required: true,
      lowercase: true,
      default: '100l',
    },
    session: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
      lowercase: true,
      default: 'first semester',
    },
    faculty: {
      type: String,
      required: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      lowercase: true,
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
