const studentModel = require("../models/studentModel");
const adminModel = require("../models/adminModel");
const academicCalendarModel = require("../models/academicCalendarModel");
const cloudinary = require("../helper/imageUpload");
const fs = require("fs");
const path = require("path");

const createStudent = async (req, res) => {
  console.log("body = " + JSON.stringify(req.body));

  const {
    surname,
    otherName,
    gender,
    dob,
    email,
    phoneNo,
    passport,
    password,
    level,
    faculty,
    department,
  } = req.body;

  const checkIfExist = await studentModel.findOne({ email });
  const checkIfExist2 = await adminModel.findOne({ email });
  if (checkIfExist || checkIfExist2) {
    res
      .status(401)
      .json({ msg: `Student with ${email} already exist`, checkIfExist });
  } else {
    try {
      const passportName = `${surname}-${email}`;

      const ext = req.file.mimetype.split("/")[1];
      const cloudresult = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${passportName}.${ext}`,
        overwrite: true,
        folder: "schoolPortal/images/studentPassports",
        width: 500,
        height: 500,
        crop: "fill",
      });

      console.log("Cloudnary result url = " + JSON.stringify(cloudresult));

      await studentModel.create(
        {
          surname,
          otherName,
          gender,
          dob,
          email,
          phoneNo,
          passport: cloudresult.secure_url,
          password,
          level,
          faculty,
          department,
        },
        (err, data) => {
          if (err) {
            console.log({ msg: "Student registeration failed ", err });
            res.status(400).json({ msg: "Student registeration failed", err });
          } else {
            const { surname, otherName, email, passport, password } = req.body;
            adminModel.create({
              surname,
              otherName,
              email,
              passport: cloudresult.secure_url,
              password,
            });
            console.log({ msg: "Student registeration successful ", data });
            res
              .status(200)
              .json({ msg: "Student registeration successful", data });
          }
        }
      );
    } catch (error) {
      console.log({
        msg: "server error, try after some time",
        error,
      });

      res.status(500).json({
        msg: "server error, try after some time",
        error,
      });
    }
  }
};

const fetchAllStudent = async (req, res) => {
  studentModel.find({}, (error, response) => {
    if (error) {
      console.log({ msg: "Students record not found ", error });
      res.status(400).json({ msg: "Students record not found", error });
    } else {
      console.log({ msg: "Students record fetched ", response });
      res.status(200).json({ msg: "Students record fetched", response });
    }
  });
};

const fetchStudent = async (req, res) => {
  const { email } = req.params;
  studentModel.findOne({ email: email }, (error, result) => {
    if (result == null) {
      console.log({ msg: `Student record with ${email} not found `, error });
      res
        .status(400)
        .json({ msg: `Student record with ${email} not found `, error });
    } else {
      console.log({ msg: `Student record fetched for ${email} `, result });
      res
        .status(200)
        .json({ msg: `Student record fetched for ${email} `, result });
    }
  });
};

const updateStudent = async (req, res) => {
  const { email } = req.params;
  studentModel.findOneAndUpdate(
    { email: email },
    req.body,
    { new: true, runValidators: true },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to update student record with ${email} `,
          error,
        });
        res.status(400).json({
          msg: `Failed to update student record with ${email} `,
          error,
        });
      } else {
        console.log({
          msg: `Student record found and updated for ${email} `,
          result,
        });
        res.status(200).json({
          msg: `Student record found and updated for ${email} `,
          result,
        });
      }
    }
  );
};

const updateById = async (req, res) => {
  const { id } = req.params;
  studentModel.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true, runValidators: true },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to update student record with ID ${id} `,
          error,
        });
        res.status(400).json({
          msg: `Failed to update student record with ID ${id} `,
          error,
        });
      } else {
        console.log({
          msg: `Student record with ID ${id} updated successfully`,
          result,
        });
        res.status(200).json({
          msg: `Student record with ID ${id} updated successfully`,
          result,
        });
      }
    }
  );
};

const delStudent = async (req, res) => {
  const { id } = req.params;
  studentModel.findOneAndDelete({ _id: id }, (error, result) => {
    if (error) {
      console.log({
        msg: `Failed to delete student record with ID ${id} `,
        error,
      });
      res
        .status(400)
        .json({ msg: `Failed to delete student record with ID ${id} `, error });
    } else {
      console.log({
        msg: `Student record with ID ${id} deleted`,
        result,
      });
      res
        .status(200)
        .json({ msg: `Student record with ID ${id} deleted`, result });
    }
  });
};

module.exports = {
  createStudent,
  fetchAllStudent,
  fetchStudent,
  updateStudent,
  updateById,
  delStudent,
};

// const studentModel = require('../models/studentModel')
// const adminModel = require('../models/adminModel')
// const academicCalendarModel = require('../models/academicCalendarModel')

// const createStudent = async (req, res) => {
//   const {
//     surname,
//     otherName,
//     gender,
//     dob,
//     email,
//     phoneNo,
//     passport,
//     password,
//     level,
//     faculty,
//     department,
//   } = req.body

//   const checkIfExist = await studentModel.findOne({ email })
//   const checkIfExist2 = await adminModel.findOne({ email })
//   if (checkIfExist || checkIfExist2) {
//     res
//       .status(401)
//       .json({ msg: `Student with ${email} already exist`, checkIfExist })
//   } else {
//     await studentModel.create(
//       {
//         surname,
//         otherName,
//         gender,
//         dob,
//         email,
//         phoneNo,
//         passport,
//         password,
//         level,
//         faculty,
//         department,
//       },
//       (err, data) => {
//         if (err) {
//           console.log({ msg: 'Student registeration failed ', err })
//           res.status(400).json({ msg: 'Student registeration failed', err })
//         } else {
//           const { surname, otherName, email, passport, password } = req.body
//           adminModel.create({ surname, otherName, email, passport, password })
//           console.log({ msg: 'Student registeration successful ', data })
//           res
//             .status(200)
//             .json({ msg: 'Student registeration successful', data })
//         }
//       },
//     )
//   }
// }

// const fetchAllStudent = async (req, res) => {
//   studentModel.find({}, (error, response) => {
//     if (error) {
//       console.log({ msg: 'Students record not found ', error })
//       res.status(400).json({ msg: 'Students record not found', error })
//     } else {
//       console.log({ msg: 'Students record fetched ', response })
//       res.status(200).json({ msg: 'Students record fetched', response })
//     }
//   })
// }

// const fetchStudent = async (req, res) => {
//   const { email } = req.params
//   studentModel.findOne({ email: email }, (error, result) => {
//     if (result == null) {
//       console.log({ msg: `Student record with ${email} not found `, error })
//       res
//         .status(400)
//         .json({ msg: `Student record with ${email} not found `, error })
//     } else {
//       console.log({ msg: `Student record fetched for ${email} `, result })
//       res
//         .status(200)
//         .json({ msg: `Student record fetched for ${email} `, result })
//     }
//   })
// }

// const updateStudent = async (req, res) => {
//   const { email } = req.params
//   studentModel.findOneAndUpdate(
//     { email: email },
//     req.body,
//     { new: true, runValidators: true },
//     (error, result) => {
//       if (error) {
//         console.log({
//           msg: `Failed to update student record with ${email} `,
//           error,
//         })
//         res.status(400).json({
//           msg: `Failed to update student record with ${email} `,
//           error,
//         })
//       } else {
//         console.log({
//           msg: `Student record found and updated for ${email} `,
//           result,
//         })
//         res.status(200).json({
//           msg: `Student record found and updated for ${email} `,
//           result,
//         })
//       }
//     },
//   )
// }

// const updateById = async (req, res) => {
//   const { id } = req.params
//   studentModel.findOneAndUpdate(
//     { _id: id },
//     req.body,
//     { new: true, runValidators: true },
//     (error, result) => {
//       if (error) {
//         console.log({
//           msg: `Failed to update student record with ID ${id} `,
//           error,
//         })
//         res.status(400).json({
//           msg: `Failed to update student record with ID ${id} `,
//           error,
//         })
//       } else {
//         console.log({
//           msg: `Student record with ID ${id} updated successfully`,
//           result,
//         })
//         res.status(200).json({
//           msg: `Student record with ID ${id} updated successfully`,
//           result,
//         })
//       }
//     },
//   )
// }

// const delStudent = async (req, res) => {
//   const { id } = req.params
//   studentModel.findOneAndDelete({ _id: id }, (error, result) => {
//     if (error) {
//       console.log({
//         msg: `Failed to delete student record with ID ${id} `,
//         error,
//       })
//       res
//         .status(400)
//         .json({ msg: `Failed to delete student record with ID ${id} `, error })
//     } else {
//       console.log({
//         msg: `Student record with ID ${id} deleted`,
//         result,
//       })
//       res
//         .status(200)
//         .json({ msg: `Student record with ID ${id} deleted`, result })
//     }
//   })
// }

// module.exports = {
//   createStudent,
//   fetchAllStudent,
//   fetchStudent,
//   updateStudent,
//   updateById,
//   delStudent,
// }
