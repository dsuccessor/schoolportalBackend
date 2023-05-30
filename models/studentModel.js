const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(mongoose.connection)

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      required: true,
      unique: true,
    },
    surname: {
      type: String,
      required: true,
      lowercase: true,
    },
    otherName: {
      type: String,
      required: true,
      lowercase: true,
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['male', 'female'],
    },
    dob: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    matricNo: {
      type: Number,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    passport: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
    },
    level: {
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

studentSchema.plugin(autoIncrement.plugin, {
  model: 'student',
  field: 'studentId',
  startAt: 10001,
  incrementBy: 395,
})
studentSchema.plugin(autoIncrement.plugin, {
  model: 'student',
  field: 'matricNo',
  startAt: 20220001,
  incrementBy: 1,
})
const studentModel = mongoose.model('student', studentSchema)

module.exports = studentModel
