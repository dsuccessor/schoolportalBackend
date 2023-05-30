const academicCalendarModel = require('../models/academicCalendarModel')

const createCalendar = async (req, res) => {
  const { session, semester } = req.body

  academicCalendarModel.find(
    {
      $and: [{ session: session }, { semester: semester }],
    },
    (error, result) => {
      if (result.length > 0) {
        console.log({
          msg: 'Academic Calendar already configured',
          result,
        })
        res.status(400).json({
          msg: 'Academic Calendar already configured',
          matricNo,
        })
      } else {
        academicCalendarModel.create(
          {
            session: session,
            semester: semester,
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
  academicCalendarModel.find({}, (error, result) => {
    if (error || result?.length < 1 || result === null) {
      console.log({
        msg: `Unable to fetch Academic configuration `,
        error,
      })
      res.status(400).json({
        msg: `Unable to fetch Academic configuration `,
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
  })
}

const deleteCalendar = (req, res) => {
  let { id } = req.params

  academicCalendarModel.findByIdAndDelete(id, (error, result) => {
    if (error) {
      console.log({
        msg: `Failed to delete Academic Configuration`,
        error,
      })
      res.status(400).json({
        msg: `Failed to delete Academic Configuration `,
        error,
      })
    } else {
      console.log({
        msg: `Academic configuration deleted`,
        result,
      })
      res.status(200).json({
        msg: `Academic configuration deleted `,
        result,
      })
    }
  })
}

const getCalendarByStatus = (req, res) => {
  const { status } = req.params

  academicCalendarModel.find({ status: status }, (error, result) => {
    if (error || result?.length < 1 || result === null) {
      console.log({
        msg: `No current Academic calendar set`,
        error,
      })
      res.status(400).json({
        msg: `No current Academic calendar set`,
        error,
      })
    } else {
      console.log({
        msg: 'Current Academic calendar fetched successfully',
        result,
      })
      res
        .status(200)
        .json({ msg: 'Current Academic calendar fetched successfully', result })
    }
  })
}

const updateCalendar = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  academicCalendarModel.findByIdAndUpdate(
    id,
    { status: status },
    { new: true, runValidators: true },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to update Academic Configuration `,
          error,
        })
        res.status(400).json({
          msg: `Failed to update Academic Configuration  `,
          error,
        })
      } else {
        if (status === 'active') {
          console.log({
            msg: `Academic configuration Enabled `,
            result,
          })
          res.status(200).json({
            msg: `Academic configuration Enabled`,
            result,
          })
        } else if (status === 'inactive') {
          console.log({
            msg: `Academic configuration Disabled `,
            result,
          })
          res.status(200).json({
            msg: `Academic configuration Disabled`,
            result,
          })
        }
      }
    },
  )
}

module.exports = {
  createCalendar,
  getCalendar,
  deleteCalendar,
  getCalendarByStatus,
  updateCalendar,
}
