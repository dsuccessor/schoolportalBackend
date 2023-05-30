const courseModel = require('../models/courseModel')
// const adminModel = require('../models/adminModel')

const createCourse = async (req, res) => {
  const {
    courseTitle,
    courseCode,
    courseUnit,
    session,
    semester,
    faculty,
    department,
  } = req.body

  const checkIfExist = await courseModel.findOne({ courseCode, department })
  if (checkIfExist) {
    res
      .status(401)
      .json({
        msg: `${courseCode} already registered for ${department} department`,
        checkIfExist,
      })
  } else {
    await courseModel.create(
      {
        courseTitle,
        courseCode,
        courseUnit,
        session,
        semester,
        faculty,
        department,
      },
      (err, data) => {
        if (err) {
          console.log({ msg: 'Course registeration failed ', err })
          res.status(400).json({ msg: 'Course registeration failed', err })
        } else {
          console.log({ msg: 'Course registeration successful ', data })
          res.status(200).json({ msg: 'Course registeration successful', data })
        }
      },
    )
  }
}

const fetchAllCourse = async (req, res) => {
  courseModel.find({}, (error, response) => {
    //     )
    //  .then((course) => {
    //     console.log({msg: 'Course record fetched ', course});
    //     res.status(200).json({msg: "Course record fetched", course})
    //  })
    //  .catch((error) => {
    //     console.log({msg: 'No course found, try course registeration first', error});
    //     res.status(400).json({msg: "No course found, try course registeration first", error})
    //  })

    if (response.length < 1) {
      console.log({
        msg: 'No course found, try course registeration first',
        error,
      })
      res
        .status(400)
        .json({ msg: 'No course found, try course registeration first', error })
    } else {
      console.log({ msg: 'Course record fetched ', response })
      res.status(200).json({ msg: 'Course record fetched', response })
    }
  })
}

const courseForm = async (req, res) => {
  const { courseId, courseId2, courseId3, courseId4, courseId5 } = req.body
  courseModel.find(
    {
      $or: [
        { courseId: courseId },
        { courseId: courseId2 },
        { courseId: courseId3 },
        { courseId: courseId4 },
        { courseId: courseId5 },
      ],
    },
    (error, result) => {
      if (result == null || result.length === 0) {
        console.log({ msg: `Course with ${courseId} not found`, error })
        res
          .status(400)
          .json({ msg: `Course with ${courseId} not found`, error })
      } else {
        console.log({ msg: `Course record fetched for ${courseId} `, result })
        res
          .status(200)
          .json({ msg: `Course record fetched for ${courseId} `, result })
      }
    },
  )
}

const fetchCourse = async (req, res) => {
  const { department } = req.params
  courseModel.find({ department: department }, (error, result) => {
    if (result == null || result.length === 0) {
      console.log({ msg: `Course with ${department} not found`, error })
      res
        .status(400)
        .json({ msg: `Course with ${department} not found`, error })
    } else {
      console.log({ msg: `Course record fetched for ${department}`, result })
      res
        .status(200)
        .json({ msg: `Course record fetched for ${department}`, result })
    }
  })
}

const updateCourse = async (req, res) => {
  const { courseCode } = req.params
  courseModel.findOneAndUpdate(
    { courseCode: courseCode },
    req.body,
    { new: true, runValidators: true },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to update course record with ${courseCode} `,
          error,
        })
        res
          .status(400)
          .json({
            msg: `Failed to update course record with ${courseCode} `,
            error,
          })
      } else {
        console.log({
          msg: `Course record found and updated for ${courseCode} `,
          result,
        })
        res
          .status(200)
          .json({
            msg: `Course record found and updated for ${courseCode} `,
            result,
          })
      }
    },
  )
}

const delCourse = async (req, res) => {
  const { courseCode } = req.params
  courseModel.findOneAndDelete({ courseCode: courseCode }, (error, result) => {
    if (error) {
      console.log({
        msg: `Failed to delete course record with ${courseCode} `,
        error,
      })
      res
        .status(400)
        .json({
          msg: `Failed to delete course record with ${courseCode} `,
          error,
        })
    } else {
      console.log({
        msg: `Course record found and deleted for ${courseCode} `,
        result,
      })
      res
        .status(200)
        .json({
          msg: `Course record found and deleted for ${courseCode} `,
          result,
        })
    }
  })
}

module.exports = {
  createCourse,
  fetchAllCourse,
  courseForm,
  fetchCourse,
  updateCourse,
  delCourse,
}
