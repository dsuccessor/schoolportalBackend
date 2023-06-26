const paymentModel = require("../models/paymentModel");
const stream = require("stream");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { MulterError } = require("multer");
const { google } = require("googleapis");

global.payId = Math.floor(Math.random() * 100) + 1;

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, path.join(__dirname, '../uploads/'))
    cb(null, `${__dirname}/uploads`);
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    var newPath = `PayEvi-${payId}-${file.originalname}.${ext}`;
    cb(null, newPath);
  },
});

const paymentNotification = (req, res) => {
  const isImage = (req, file, cb) => {
    const {
      studentId,
      bankName,
      payeeName,
      amount,
      narration,
      paymentDate,
      fileType,
    } = req.body;

    const myExt = fileType?.split("/")[1];

    paymentModel.findOne(
      { $and: [{ narration }, { amount }] },
      (err, result) => {
        if (result !== null && result !== undefined) {
          console.log({
            msg: `Payment with narration ${narration} and amount ${amount} already exists`,
            result,
          });
          console.log(JSON.stringify(file));
          res.status(400).json({
            msg: `Payment with narration ${narration} and amount ${amount} already exists`,
          });
        } else {
          paymentModel.create(
            {
              studentId,
              bankName,
              payeeName,
              amount,
              narration,
              paymentEvidence: `PayEvi-${payId}-${studentId}-${paymentDate}-${bankName}.${myExt}`,
              paymentDate,
            },
            (err, result) => {
              if (err) {
                console.log({
                  msg: "Unable to send Payment Notification, Kindly retry",
                  err,
                });

                res.status(400).json({
                  msg: "Unable to send Payment Notification, Kindly retry",
                });
              } else {
                if (file.mimetype.startsWith("image")) {
                  cb(null, true);
                } else {
                  console.log({
                    msg: `Wrong file uploaded, Make sure the file uploaded is an image file`,
                  });

                  res.status(400).json({
                    msg: `Wrong file uploaded, Make sure the file uploaded is an image file`,
                  });
                }
              }
            }
          );
        }
      }
    );
  };

  const postUpload = multer({
    dest: "payment evidence",
    storage: multerConfig,
    fileFilter: isImage,
  }).any();

  //single("paymentEvidence");

  postUpload(req, res, (err) => {
    // Google Upload Begin

    const KEYFILEPATH = path.join(__dirname, "kaycadCredential.json");
    const SCOPES = ["https://www.googleapis.com/auth/drive"];

    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });

    const uploadFile = async (fileObject, myBuffer) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(myBuffer);
      const { data } = await google
        .drive({ version: "v3", auth: auth })
        .files.create({
          media: {
            mimeType: fileObject.mimetype,
            body: bufferStream,
          },
          requestBody: {
            name: fileObject.filename,
            parents: ["1oaWZiL8GJF-kHVMJNgk5G5_4sJhN8KB5"],
          },
          fields: "id,name",
        });
      console.log(`Uploaded file ${data.name} ${data.id}`);
    };

    try {
      console.log(req.body);
      console.log(req.files);
      const { body, files } = req;

      for (let f = 0; f < files.length; f += 1) {
        function base64_encode(myfile) {
          const str = fs.readFileSync(myfile, "base64");

          //const str = await image.toString('base64');

          const buffer = Buffer.from(str, "base64");
          //console.log("body uri in = " + myfile);

          return buffer;
        }

        //var myBuffer = base64_encode(files[f].path);
        var myBuffer = base64_encode(files[f].path);
        //console.log("body uri out = " + body.uri);
        //console.log("buffer = " + myBuffer);

        uploadFile(files[f], myBuffer);
      }

      // function base64_encode(myfile) {
      //   const str = fs.readFileSync(myfile, "base64");

      //   //const str = await image.toString('base64');

      //   const buffer = Buffer.from(str, "base64");

      //   return buffer;
      // }

      // var myBuffer = base64_encode(body.uri);
      // console.log("buffer = " + myBuffer);

      // uploadFile(files[0], myBuffer);

      console.log(body);

      console.log({
        msg: "Payment Notification sent successfully",
      });
      res.status(200).json({ msg: "Payment Notification sent successfully" });
    } catch (f) {
      console.log({
        msg: "Payment Evidence Failed to Safe",
      });

      res.status(400).json({ msg: "Payment Evidence Failed to Safe" });
    }

    if (err instanceof multer.MulterError) {
      console.log({ msg: "Payment Evidence Upload failed", err });

      res.status(400).json({ msg: "Payment Evidence Upload failed" });
    } else if (err) {
      console.log({
        msg: "Unable to send Payment Notification, Kindly retry",
        err,
      });
      res
        .status(400)
        .json({ msg: "Unable to send Payment Notification, Kindly retry" });
    }
  });
};

const paymentConfirmationRequest = async (req, res) => {
  paymentModel.find({ adminConfirmStatus: "pending" }, (error, response) => {
    if (error) {
      console.log({ msg: "No Payment Notification found", error });
      res.status(400).json({ msg: "No Payment Notification found", error });
    } else {
      console.log({ msg: "Payment Notification fetched ", response });
      res.status(200).json({ msg: "Payment Notification fetched", response });
    }
  });
};

const adminPaymentRequestHistory = async (req, res) => {
  paymentModel.find({}, (error, response) => {
    if (error) {
      console.log({ msg: "No Payment Notification found", error });
      res.status(400).json({ msg: "No Payment Notification found", error });
    } else {
      console.log({ msg: "Payment Notification fetched ", response });
      res.status(200).json({ msg: "Payment Notification fetched", response });
    }
  });
};

const paymentConfirmation = async (req, res) => {
  const { paymentId } = req.params;
  const { adminConfirmStatus, adminName, declineReason } = req.body;
  paymentModel.findOne({ paymentId: paymentId }, (error, result) => {
    if (result === null || result === undefined) {
      console.log({ msg: `No Payment Notification found `, error });
      res.status(400).json({ msg: `No Payment Notification found`, error });
    } else {
      paymentModel.findOneAndUpdate(
        { paymentId: paymentId },
        {
          adminConfirmStatus: adminConfirmStatus,
          adminName: adminName,
          declineReason: declineReason,
        },
        {
          new: true,
          runValidators: true,
        },
        (error, result) => {
          if (error) {
            console.log({
              msg: `Failed to confirm/approve payment`,
              error,
            });
            res.status(400).json({
              msg: `Failed to confirm/approve payment `,
              error,
            });
          } else {
            if (adminConfirmStatus === "approved") {
              console.log({
                msg: `Payment confirmed successfully`,
                result,
              });
              res.status(200).json({
                msg: `Payment confirmed successfully`,
                result,
              });
            } else {
              console.log({
                msg: `Payment declined successfully`,
                result,
              });
              res.status(200).json({
                msg: `Payment declined successfully`,
                result,
              });
            }
          }
        }
      );
    }
  });
};

const paymentNotificationHistory = async (req, res) => {
  const { studentId } = req.params;
  // const { studentId } = req.body
  paymentModel.find({ studentId: studentId }, (error, result) => {
    if (result === null || result === undefined) {
      console.log({ msg: `No Payment Notification found `, error });
      res.status(400).json({ msg: `No Payment Notification found`, error });
    } else {
      console.log({ msg: `Payment Notification fetched `, result });
      res.status(200).json({ msg: `Payment Notification fetched `, result });
    }
  });
};

const userFetchWalletHistory = async (req, res) => {
  const { studentId } = req.params;
  paymentModel.find(
    { $and: [{ studentId: studentId }, { adminConfirmStatus: true }] },
    (error, result) => {
      if (result === null || result === undefined) {
        console.log({ msg: `No Payment history found on your wallet`, error });
        res
          .status(400)
          .json({ msg: `No Payment history found on your wallet`, error });
      } else {
        console.log({ msg: `Wallet history fetched `, result });
        res.status(200).json({ msg: `Wallet history fetched `, result });
      }
    }
  );
};

const searchFetchPayNotification = async (req, res) => {
  const { paymentId } = req.params;
  paymentModel.findOne({ paymentId: paymentId }, (error, result) => {
    if (result == null) {
      console.log({
        msg: `No Payment Notification found for ${paymentId} `,
        error,
      });
      res.status(400).json({
        msg: `No Payment Notification found for ${paymentId} `,
        error,
      });
    } else {
      console.log({
        msg: `Payment Notification fetched for ${paymentId} `,
        result,
      });
      res.status(200).json({
        msg: `Payment Notification fetched for ${paymentId} `,
        result,
      });
    }
  });
};

const delPayNotification = async (req, res) => {
  const { paymentId } = req.params;
  paymentModel.findOneAndDelete({ paymentId: paymentId }, (error, result) => {
    if (error) {
      console.log({
        msg: `Failed to delete payment notification with ${paymentId} `,
        error,
      });
      res.status(400).json({
        msg: `Failed to delete payment notification with ${paymentId} `,
        error,
      });
    } else {
      console.log({
        msg: `Payment notification found and deleted for ${paymentId} `,
        result,
      });
      res.status(200).json({
        msg: `Payment notification found and deleted for ${paymentId} `,
        result,
      });
    }
  });
};

module.exports = {
  paymentNotification,
  paymentConfirmationRequest,
  adminPaymentRequestHistory,
  paymentConfirmation,
  paymentNotificationHistory,
  userFetchWalletHistory,
  searchFetchPayNotification,
  delPayNotification,
};
