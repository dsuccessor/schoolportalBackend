const academicCalendarModel = require('../models/academicCalendarModel')

const createCalendar = async (req, res) => {
  const {
    studentId,
    matricNo,
    level,
    session,
    semester,
    faculty,
    department,
  } = req.body

  academicCalendarModel.find(
    {
      $or: [{ studentId: studentId }, { matricNo: matricNo }],
    },
    (error, result) => {
      if (result.length > 0) {
        console.log({
          msg: 'Academic Calendar already configured for student',
          result,
        })
        res.status(400).json({
          msg: 'Academic Calendar already configured for student',
          matricNo,
        })
      } else {
        academicCalendarModel.create(
          {
            studentId: studentId,
            matricNo: matricNo,
            level: level,
            session: session,
            semester: semester,
            faculty: faculty,
            department: department,
          },
          (error, result) => {
            if (error) {
              console.log({
                msg: 'Academic Calendar configuration failed',
                error,
              })
              res
                .status(400)
                .json({ msg: 'Academic Calendar configuration failed', error })
            } else {
              console.log({
                msg: 'Academic Calendar configured successfully',
                result,
              })
              res.status(200).json({
                msg: 'Academic Calendar configured successfully',
                result,
              })
            }
          },
        )
      }
    },
  )
}

const getCalendar = (req, res) => {
  let { studentId, matricNo } = req.params

  // session = session?.split('-')[0].concat('/', session?.split('-')[1])

  // console.log(feeCategory, mysession)

  academicCalendarModel.findOne(
    {
      $and: [{ studentId: studentId }, { matricNo: matricNo }],
    },
    (error, result) => {
      if (error || result?.length < 1 || result === null) {
        console.log({
          msg: `Unable to fetch Academic configuration for ${matricNo} `,
          error,
        })
        res.status(400).json({
          msg: `Unable to fetch Academic configuration for ${matricNo} `,
          error,
        })
      } else {
        console.log({
          msg: 'Academic configuration fetched successfully',
          result,
        })
        res
          .status(200)
          .json({ msg: 'Academic configuration fetched successfully', result })
      }
    },
  )
}

const deleteCalendar = (req, res) => {
  let { studentId, matricNo } = req.params

  academicCalendarModel.findOneAndDelete(
    {
      $and: [{ studentId: studentId }, { matricNo: matricNo }],
    },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to delete Academic Configuration for ${matricNo} `,
          error,
        })
        res.status(400).json({
          msg: `Failed to delete Academic Configuration for ${matricNo} `,
          error,
        })
      } else {
        console.log({
          msg: `Academic configuration deleted for ${matricNo} `,
          result,
        })
        res.status(200).json({
          msg: `Academic configuration deleted for ${matricNo} `,
          result,
        })
      }
    },
  )
}

const updateCalendar = async (req, res) => {
  const { studentId, matricNo } = req.params

  studentModel.findOneAndUpdate(
    {
      $and: [{ studentId: studentId }, { matricNo: matricNo }],
    },
    req.body,
    { new: true, runValidators: true },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to update Academic Configuration for ${matricNo} `,
          error,
        })
        res.status(400).json({
          msg: `Failed to update Academic Configuration for ${matricNo} `,
          error,
        })
      } else {
        console.log({
          msg: `Academic configuration updated for ${matricNo} `,
          result,
        })
        res.status(200).json({
          msg: `Academic configuration updated for ${matricNo} `,
          result,
        })
      }
    },
  )
}

module.exports = {
  createCalendar,
  getCalendar,
  deleteCalendar,
  updateCalendar,
}
