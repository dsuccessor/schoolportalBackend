const mongoose = require('mongoose')

const courseFormSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      required: true,
      unique: true,
    },
    course: [
      {
        courseId: {
          type: Number,
          required: true,
          unique: true,
        },
        courseTitle: {
          type: String,
          required: true,
          lowercase: true,
        },
        courseCode: {
          type: String,
          required: true,
          lowercase: true,
        },
        courseUnit: {
          type: Number,
          required: true,
        },
      },
    ],
    semester: {
      type: String,
      required: true,
      lowercase: true,
    },
    session: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
)

const courseFormModel = mongoose.model('courseform', courseFormSchema)

module.exports = courseFormModel
