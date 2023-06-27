const paymentModel = require("../models/paymentModel");
const cloudinary = require("../helper/imageUpload");
const fs = require("fs");
const path = require("path");

global.payId = Math.floor(Math.random() * 100) + 1;

const paymentNotification = async (req, res) => {
  //console.log("body received = " + JSON.stringify(req.body));
  //console.log("body file = " + JSON.stringify(req.file));
  try {
    const {
      studentId,
      bankName,
      amountPaid,
      payNarration,
      payeeName,
      paymentDate,
    } = req.body;
    const ext = req.file.mimetype.split("/")[1];
    const cloudresult = await cloudinary.uploader.upload(req.file.path, {
      public_id: `PayEvi-${payId}-${req.file.originalname}.${ext}`,
      width: 500,
      height: 500,
      crop: "fill",
    });

    console.log("Cloudnary result url = " + JSON.stringify(cloudresult));

    paymentModel.findOne(
      { $and: [{ narration: payNarration }, { amount: amountPaid }] },
      (err, result) => {
        if (result !== null && result !== undefined) {
          console.log({
            msg: `Payment with narration ${payNarration} and amount ${amountPaid} already exists`,
            result,
          });
          //console.log(JSON.stringify(file));
          res.status(400).json({
            msg: `Payment with narration ${narration} and amount ${amount} already exists`,
          });
        } else {
          paymentModel.create(
            {
              studentId,
              bankName,
              payeeName,
              amount: amountPaid,
              narration: payNarration,
              paymentEvidence: cloudresult.url,
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
                if (result !== null && result !== undefined) {
                  console.log({
                    msg: "Payment Notification sent successfully",
                    err,
                  });

                  res.status(200).json({
                    msg: "Payment Notification sent successfully",
                    result,
                  });
                } else {
                  console.log({
                    msg: "Unknown error while sending payment notification",
                    err,
                  });

                  res.status(400).json({
                    msg: "Unknown error while sending payment notification",
                    err,
                  });
                }
              }
            }
          );
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
};

module.exports = {
  paymentNotification,
};
