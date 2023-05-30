const express = require('express')
// const serverless = require('serverless-http')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 3001
const dotenv = require('dotenv')
dotenv.config()
const adminRoute = require('./routes/adminRoute')
const studentRoute = require('./routes/studentRoute')
const loginRoute = require('./routes/loginRoute')
const courseRoute = require('./routes/courseRoute')
const courseFormRoute = require('./routes/courseFormRoute')
const paymentRoute = require('./routes/paymentRoute')
const walletHistoryRoute = require('./routes/walletHistoryRoute')
const feeListRoute = require('./routes/feeListRoute')
const academicCalendarRoute = require('./routes/academicCalendarRoute')
const schoolDuesRoute = require('./routes/schoolDuesRoute')
const cors = require('cors')

// Mongoose configuration
mongoose.connect(process.env.MONGO_DB, (error, response) => {
  if (error) {
    console.log('Unable to connect to Mongoose Server ' + error)
  } else {
    console.log('Connected to Mongoose Server ' + response)
  }
})

// Middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/admin', adminRoute)

app.use('/', loginRoute)

app.use('/student', studentRoute)

app.use('/course', courseRoute)

app.use('/courseform', courseFormRoute)

app.use('/paymentNotification', paymentRoute)

app.use('/wallet', walletHistoryRoute)

app.use('/paymentadvice', feeListRoute)

app.use('/academiccalendar', academicCalendarRoute)

app.use('/schooldue', schoolDuesRoute)

// Xpress Server connection
app.listen(port, (error) => {
  if (error) {
    console.log('Failed to connect to Xpress Server ' + error)
  } else {
    console.log('Connection to Xpress Server Established')
  }
})

// module.exports = app
// module.exports.handler = serverless(app)
