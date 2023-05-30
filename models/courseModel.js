const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(mongoose.connection)

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: Number,
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
    session: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
      lowercase: true,
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

courseSchema.plugin(autoIncrement.plugin, {
  model: 'course',
  field: 'courseId',
  startAt: 10001,
  incrementBy: 108,
})
const courseModel = mongoose.model('course', courseSchema)

module.exports = courseModel
