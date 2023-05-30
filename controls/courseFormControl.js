const courseFormModel = require("../models/courseFormModel");

const createCourseForm = async (req, res) => {
  const {
    studentId,
    course,
    courseId,
    courseTitle,
    courseCode,
    courseUnit,
    semester,
    session,
  } = req.body;

  const checkIfExist = await courseFormModel.findOne({
    $and: [
      { studentId: studentId },
      { semester: semester },
      { session: session },
    ],
  });
  if (checkIfExist) {
    console.log({
      msg: "You have already completed your course registeration, Kindly proceed to printing your course form if you havent",
      result: checkIfExist,
    });
    res.status(400).json({
      msg: "You have already completed your course registeration, Kindly proceed to printing your course form if you havent",
    });
  } else {
    courseFormModel.create(
      {
        studentId,
        course,
        courseId,
        courseTitle,
        courseCode,
        courseUnit,
        semester,
        session,
      },
      (error, result) => {
        if (error) {
          console.log({ msg: "Unable to register course for student", error });
          res
            .status(400)
            .json({ msg: "Unable to register course for student", error });
        } else {
          console.log({ msg: "course Registeration Succesful", result });
          res
            .status(200)
            .json({ msg: "course Registeration Succesful", result });
        }
      }
    );
  }
};

const fetchCourseForm = async (req, res) => {
  // const { studentId, semester, session } = req.params
  const { studentId } = req.params;

  courseFormModel.findOne(
    {
      studentId: studentId,
      // $and: [
      //   { studentId: studentId },
      //   { semester: semester },
      //   { session: session },
      // ],
    },
    (error, result) => {
      if (error) {
        console.log({ msg: "Unable to fetch record", error });
        res.status(400).json({ msg: "Unable to fetch record", error });
      } else if (result === null || result.length === 0) {
        console.log({ msg: "You havent register for any course yet", error });
        res
          .status(400)
          .json({ msg: "You havent register for any course yet", error });
      } else {
        console.log({
          msg: `CourseForm record fetched for student ${studentId} `,
          result,
        });
        res.status(200).json({
          msg: `CourseForm record fetched for student ${studentId} `,
          result,
        });
      }
    }
  );
};

const searchCourseForm = async (req, res) => {
  const { studentId, semester, session } = req.body;
  courseFormModel.find(
    { studentId: studentId, semester: semester, session: session },
    (error, result) => {
      if (result == null || result.length === 0) {
        console.log({ msg: `Course with ${studentId} not found`, error });
        res
          .status(400)
          .json({ msg: `Course with ${studentId} not found`, error });
      } else {
        console.log({ msg: `Course record fetched for ${studentId}`, result });
        res
          .status(200)
          .json({ msg: `Course record fetched for ${studentId}`, result });
      }
    }
  );
};

const updateCourseForm = async (req, res) => {
  const { studentId } = req.params;
  courseFormModel.findOneAndUpdate(
    { studentId: studentId },
    req.body,
    { new: true, runValidators: true },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to update course form for student with ID ${studentId} `,
          error,
        });
        res.status(400).json({
          msg: `Failed to update course form for student with ID ${studentId} `,
          error,
        });
      } else {
        console.log({
          msg: `Course form record found and updated for student with ID ${studentId} `,
          result,
        });
        res.status(200).json({
          msg: `Course form record found and updated for student with ID ${studentId} `,
          result,
        });
      }
    }
  );
};

const delCourseForm = async (req, res) => {
  const { studentId } = req.params;
  courseFormModel.findOneAndDelete(
    { studentId: studentId },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to delete course form for student with ID ${studentId}`,
          error,
        });
        res.status(400).json({
          msg: `Failed to delete course form for student with ID ${studentId}`,
          error,
        });
      } else {
        console.log({
          msg: `Course form found and deleted for ${studentId} `,
          result,
        });
        res.status(200).json({
          msg: `Course form found and deleted for ${studentId} `,
          result,
        });
      }
    }
  );
};

const testCourseForm = async (req, res) => {
  const { studentId, semester, session } = req.body;

  const checkIfExist = await courseFormModel.find({
    $and: [
      { studentId: studentId },
      { semester: semester },
      { session: session },
    ],
  });
  if (checkIfExist !== null) {
    console.log({
      msg: "Record found",
      checkIfExist,
    });
    res.status(200).json({ msg: "Record found", checkIfExist });
  } else {
    console.log({
      msg: "Record not found",
      checkIfExist,
    });
    res.status(400).json({ msg: "Record not found", checkIfExist });
  }
};

module.exports = {
  createCourseForm,
  fetchCourseForm,
  searchCourseForm,
  updateCourseForm,
  delCourseForm,
  testCourseForm,
};
