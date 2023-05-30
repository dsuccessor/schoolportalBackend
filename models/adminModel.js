const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(mongoose.connection)

const adminSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    surname: {
        type: String,
        required: true,
        lowercase: true
    },
    otherName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    passport: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 64,
        regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Admin', 'student', 'others'],
        required: true,
        default: 'student'
    }
},
    {
        timestamps: true
    }
)

adminSchema.plugin(autoIncrement.plugin, {model: 'user', field: 'userId', startAt: 10001, incrementBy: 395})

const adminModel = mongoose.model('user', adminSchema)

module.exports = adminModel


