const schoolDuesModel = require('../models/schoolDuesModel')

const payDue = async (req, res) => {
  const {
    feeId,
    studentId,
    matricNo,
    session,
    semester,
    level,
    feeName,
    amount,
    paymentRef,
  } = req.body

  // const myref =
  //   Math.floor(Math.random() * (9999999999 - 1111111111 + 1)) + 1111111111

  // const currDate = new Date()
  // const myDay = currDate.getDay()
  // const myMonth = currDate.getMonth()
  // const myYear = currDate.getFullYear()
  // const myDate = `${myYear}${myMonth}${myDay}`

  // const paymentRef = `${feeName.split(' ')[0]}${
  //   feeName.split(' ')[1]
  // }${myDate}${matricNo}${session.split('/')[0]}${session.split('/')[1]}${level}`

  const status = 'paid'

  schoolDuesModel.find(
    {
      $and: [
        { matricNo: matricNo },
        { feeName: feeName },
        { amount: amount },
        { session: session },
      ],
    },
    (error, result) => {
      if (result.length > 0) {
        console.log({ msg: 'Duplicate payment suspected', result })
        res.status(400).json({ msg: 'Duplicate payment suspected', result })
      } else {
        schoolDuesModel.create(
          {
            feeId: feeId,
            studentId: studentId,
            matricNo: matricNo,
            session: session,
            semester: semester,
            level: level,
            feeName: feeName,
            amount: amount,
            paymentRef: paymentRef,
            status: status,
          },
          (error, result) => {
            if (error) {
              console.log({ msg: 'Payment failed', error })
              res.status(400).json({ msg: 'Payment failed', error })
            } else {
              console.log({ msg: 'Payment successful', result })
              res.status(200).json({ msg: 'Payment successful', result })
            }
          },
        )
      }
    },
  )
}

const getDueByRef = (req, res) => {
  let { paymentRef } = req.params

  schoolDuesModel.findOne({ paymentRef: paymentRef }, (error, result) => {
    if (error || result?.length < 1 || result === null) {
      console.log({ msg: 'Payment does not exist', error })
      res.status(400).json({ msg: 'Payment does not exist', error })
    } else {
      console.log({ msg: 'Payment fetched successfully', result })
      res.status(200).json({ msg: 'Payment fetched successfully', result })
    }
  })
}

const getDueByAny = (req, res) => {
  let { search } = req.params

  if (search.includes('-')) {
    search = `${search.split('-')[0]}/${search.split('-')[1]}`
    return search
  }

  schoolDuesModel.find(
    {
      $or: [
        { feeName: search },
        { session: search },
        { semester: search },
        { level: search },
        { status: search },
      ],
    },
    (error, result) => {
      if (error || result?.length < 1 || result === null) {
        console.log({ msg: 'Payment does not exist', error })
        res.status(400).json({ msg: 'Payment does not exist', error })
      } else {
        console.log({ msg: 'Payment fetched successfully', result })
        res.status(200).json({ msg: 'Payment fetched successfully', result })
      }
    },
  )
}

const getDueByMany = (req, res) => {
  let { matricNo, session, semester, level, amount, feeName } = req.params

  session = session?.split('-')[0].concat('/', session?.split('-')[1])

  schoolDuesModel.find(
    {
      $and: [
        { matricNo: matricNo },
        { session: session },
        { semester: semester },
        { level: level },
        { amount: amount },
        { feeName: feeName },
      ],
    },
    (error, result) => {
      if (error || result?.length < 1 || result === null) {
        console.log({ msg: 'Payment does not exist', error })
        res
          .status(400)
          .json({ msg: 'Payment does not exist', status: 'Pending', error })
      } else {
        console.log({ msg: 'Payment fetched successfully', result })
        res
          .status(200)
          .json({ msg: 'Payment fetched successfully', status: 'Paid', result })
      }
    },
  )
}

const getDueByFeeId = (req, res) => {
  let { feeId } = req.params

  schoolDuesModel.findOne({ feeId: feeId }, (error, result) => {
    if (error || result?.length < 1 || result === null) {
      console.log({ msg: 'Payment does not exist', status: 'pending', error })
      res
        .status(400)
        .json({ msg: 'Payment does not exist', status: 'pending', error })
    } else {
      console.log({
        msg: 'Payment fetched successfully',
        status: 'paid',
        result,
      })
      res
        .status(200)
        .json({ msg: 'Payment fetched successfully', status: 'paid', result })
    }
  })
}

const getAllDue = (req, res) => {
  schoolDuesModel.find({}, (error, result) => {
    if (error || result?.length < 1 || result === null) {
      console.log({ msg: 'No payment record found', error })
      res.status(400).json({ msg: 'No payment record found', error })
    } else {
      console.log({ msg: 'Payment record fetched successfully', result })
      res
        .status(200)
        .json({ msg: 'Payment record fetched successfully', result })
    }
  })
}
module.exports = {
  payDue,
  getDueByRef,
  getDueByAny,
  getDueByMany,
  getDueByFeeId,
  getAllDue,
}
