const { default: mongoose } = require('mongoose')
const walletHistoryModel = require('../models/walletHistoryModel')

const fundWallet = async (req, res) => {
  const {
    walletId,
    payment,
    amount,
    paymentRef,
    paymentType,
    txnType,
    balanceBefore,
    walletBalance,
  } = req.body

  walletHistoryModel.find(
    { $or: [{ payment: payment }, { paymentRef: paymentRef }] },
    (err, result) => {
      if (result === null || result.length != 0) {
        console.log({
          msg: 'Payment already exist on wallet history',
          result,
        })
        res.status(400).json({ msg: 'Payment already exist on wallet history' })
      } else {
        walletHistoryModel.create(
          {
            walletId,
            payment,
            amount,
            paymentRef,
            paymentType,
            txnType,
            balanceBefore,
            walletBalance,
          },
          (err, data) => {
            if (err) {
              console.log({
                msg: `Unable to fund wallet `,
                err,
              })
              res.status(400).json({ msg: `Unable to fund wallet `, err })
            } else {
              console.log({
                msg: `Wallet funded successful `,
                data,
              })
              res.status(200).json({ msg: `Wallet funded successful ` })
            }
          },
        )
      }
    },
  )
}

const walletBalance = async (req, res) => {
  const { walletId } = req.params
  walletHistoryModel
    .find({ walletId: walletId })
    .limit(1)
    .sort({ $natural: -1 })
    .then((response) => {
      if (response.length < 1) {
        response = [{ walletBalance: { $numberDecimal: 0.0 } }]
        console.log({ msg: 'Wallet Balance fetched ', response })
        res.status(200).json({ msg: 'Wallet Balance fetched', response })
      } else {
        console.log({ msg: 'Wallet Balance fetched ', response })
        res.status(200).json({ msg: 'Wallet Balance fetched', response })
      }
    })
    .catch((err) => {
      console.log({ msg: 'No wallet record found', err })
      res.status(400).json({ msg: 'No wallet record found', err })
    })
}

const studentWalletHistory = async (req, res) => {
  const { walletId } = req.params
  walletHistoryModel
    .find({ walletId: walletId })
    .populate('payment')
    .exec((error, result) => {
      if (result == null) {
        console.log({ msg: `No wallet history found `, error })
        res.status(400).json({ msg: `No wallet history found`, error })
      } else {
        console.log({ msg: `Wallet fetched `, result })
        res.status(200).json({ msg: `Wallet fetched `, result })
      }
    })
}

const adminWalletHistory = async (req, res) => {
  walletHistoryModel
    .find()
    .populate('payment')
    .exec((error, result) => {
      if (result == null) {
        console.log({ msg: `No wallet history found `, error })
        res.status(400).json({ msg: `No wallet history found`, error })
      } else {
        console.log({ msg: `Wallet fetched `, result })
        res.status(200).json({ msg: `Wallet fetched `, result })
      }
    })
}

const filterWalletHistory = async (req, res) => {
  const {
    walletId,
    paymentId,
    txnType,
    paymentType,
    fromDate,
    toDate,
  } = req.body

  const checkNull = [paymentId, txnType, paymentType, fromDate, toDate].every(
    (element) => element === null || element === undefined,
  )
  // filter by wallet Id
  if (walletId && checkNull) {
    walletHistoryModel
      .find({ walletId: walletId })
      .populate('payment')
      .exec((error, result) => {
        if (result == null) {
          console.log({ msg: `No wallet history found `, error })
          res.status(400).json({ msg: `No wallet history found`, error })
        } else {
          console.log({ msg: `Wallet fetched `, result })
          res.status(200).json({ msg: `Wallet fetched `, result })
        }
      })
  } else {
    const checkNull = [walletId, txnType, paymentType, fromDate, toDate].every(
      (element) => element === null || element === undefined,
    )
    // filter by payment
    if (paymentId && checkNull) {
      walletHistoryModel
        .aggregate([
          {
            $lookup: {
              from: 'payments',
              localField: 'payment',
              foreignField: '_id',
              as: 'paymentResult',
            },
          },
        ])
        .exec((error, results) => {
          if (results == null) {
            console.log({ msg: `No wallet history found `, error })
            res.status(400).json({ msg: `No wallet history found`, error })
          } else {
            let result = results.find(
              (wallet) => wallet.paymentResult[0].paymentId == paymentId,
            )
            const { payment } = result
            walletHistoryModel
              .find({ payment: payment })
              .populate('payment')
              .exec((error, result) => {
                if (result == null) {
                  console.log({ msg: `No wallet history found `, error })
                  res
                    .status(400)
                    .json({ msg: `No wallet history found`, error })
                } else {
                  console.log({ msg: `Wallet fetched `, result })
                  res.status(200).json({ msg: `Wallet fetched `, result })
                }
              })

            // console.log({ msg: `Wallet fetched `, result: [result] })
            // res.status(200).json({ msg: `Wallet fetched `, result: [result] })
          }
        })
    } else {
      const checkNull = [
        walletId,
        paymentId,
        paymentType,
        fromDate,
        toDate,
      ].every((element) => element === null || element === undefined)

      // filter by txn type
      if (txnType && checkNull) {
        walletHistoryModel
          .find({ txnType: txnType })
          .populate('payment')
          .exec((error, result) => {
            if (result == null) {
              console.log({ msg: `No wallet history found `, error })
              res.status(400).json({ msg: `No wallet history found`, error })
            } else {
              console.log({ msg: `Wallet fetched `, result })
              res.status(200).json({ msg: `Wallet fetched `, result })
            }
          })
      } else {
        const checkNull = [
          walletId,
          paymentId,
          txnType,
          fromDate,
          toDate,
        ].every((element) => element === null || element === undefined)

        // filter by payment type
        if (paymentType && checkNull) {
          walletHistoryModel
            .find({ paymentType: paymentType })
            .populate('payment')
            .exec((error, result) => {
              if (result == null) {
                console.log({ msg: `No wallet history found `, error })
                res.status(400).json({ msg: `No wallet history found`, error })
              } else {
                console.log({ msg: `Wallet fetched `, result })
                res.status(200).json({ msg: `Wallet fetched `, result })
              }
            })
        } else {
          const checkNull = [walletId, paymentId, txnType, paymentType].every(
            (element) => element === null || element === undefined,
          )

          // filter by date
          if (fromDate && toDate && checkNull) {
            walletHistoryModel
              .find({
                $and: [
                  { updatedAt: { $gte: fromDate } },
                  { updatedAt: { $lte: toDate } },
                ],
              })
              .populate('payment')
              .exec((error, result) => {
                if (result == null) {
                  console.log({ msg: `No wallet history found `, error })
                  res
                    .status(400)
                    .json({ msg: `No wallet history found`, error })
                } else {
                  console.log({ msg: `Wallet fetched `, result })
                  res.status(200).json({ msg: `Wallet fetched `, result })
                }
              })
          } else {
            const checkNull = [paymentId, txnType, paymentType].every(
              (element) => element === null || element === undefined,
            )

            // filter by wallet Id and date
            if (walletId && fromDate && toDate && checkNull) {
              walletHistoryModel
                .find({
                  $and: [
                    { walletId: walletId },
                    { updatedAt: { $gte: fromDate } },
                    { updatedAt: { $lte: toDate } },
                  ],
                })
                .populate('payment')
                .exec((error, result) => {
                  if (result == null) {
                    console.log({ msg: `No wallet history found `, error })
                    res
                      .status(400)
                      .json({ msg: `No wallet history found`, error })
                  } else {
                    console.log({ msg: `Wallet fetched `, result })
                    res.status(200).json({ msg: `Wallet fetched `, result })
                  }
                })
            } else {
              const checkNull = [walletId, txnType, paymentType].every(
                (element) => element === null || element === undefined,
              )

              // filter by payment Id and date
              if (paymentId && fromDate && toDate && checkNull) {
                walletHistoryModel
                  .aggregate([
                    {
                      $lookup: {
                        from: 'payments',
                        localField: 'payment',
                        foreignField: '_id',
                        as: 'paymentResult',
                      },
                    },
                  ])
                  .exec((error, results) => {
                    if (results == null) {
                      console.log({ msg: `No wallet history found `, error })
                      res
                        .status(400)
                        .json({ msg: `No wallet history found`, error })
                    } else {
                      let result = results.find(
                        (wallet) =>
                          wallet.paymentResult[0].paymentId == paymentId,
                      )
                      const { payment } = result

                      walletHistoryModel
                        .find({
                          $and: [
                            { payment: payment },
                            { updatedAt: { $gte: fromDate } },
                            { updatedAt: { $lte: toDate } },
                          ],
                        })
                        .populate('payment')
                        .exec((error, result) => {
                          if (result == null) {
                            console.log({
                              msg: `No wallet history found `,
                              error,
                            })
                            res
                              .status(400)
                              .json({ msg: `No wallet history found`, error })
                          } else {
                            console.log({ msg: `Wallet fetched `, result })
                            res
                              .status(200)
                              .json({ msg: `Wallet fetched `, result })
                          }
                        })
                    }
                  })
              } else {
                const checkNull = [
                  paymentId,
                  paymentType,
                  fromDate,
                  toDate,
                ].every((element) => element === null || element === undefined)

                // filter by wallet Id and txn type
                if (walletId && txnType && checkNull) {
                  walletHistoryModel
                    .find({
                      $and: [{ walletId: walletId }, { txnType: txnType }],
                    })
                    .populate('payment')
                    .exec((error, result) => {
                      if (result == null) {
                        console.log({ msg: `No wallet history found `, error })
                        res
                          .status(400)
                          .json({ msg: `No wallet history found`, error })
                      } else {
                        console.log({ msg: `Wallet fetched `, result })
                        res.status(200).json({ msg: `Wallet fetched `, result })
                      }
                    })
                } else {
                  const checkNull = [
                    paymentId,
                    txnType,
                    fromDate,
                    toDate,
                  ].every(
                    (element) => element === null || element === undefined,
                  )

                  // filter by wallet Id and payment type
                  if (walletId && paymentType && checkNull) {
                    walletHistoryModel
                      .find({
                        $and: [
                          { walletId: walletId },
                          { paymentType: paymentType },
                        ],
                      })
                      .populate('payment')
                      .exec((error, result) => {
                        if (result == null) {
                          console.log({
                            msg: `No wallet history found `,
                            error,
                          })
                          res
                            .status(400)
                            .json({ msg: `No wallet history found`, error })
                        } else {
                          console.log({ msg: `Wallet fetched `, result })
                          res
                            .status(200)
                            .json({ msg: `Wallet fetched `, result })
                        }
                      })
                  } else {
                    const checkNull = [
                      walletId,
                      paymentId,
                      fromDate,
                      toDate,
                    ].every(
                      (element) => element === null || element === undefined,
                    )

                    // filter by payment type and txn type
                    if (paymentType && txnType && checkNull) {
                      walletHistoryModel
                        .find({
                          $and: [
                            { paymentType: paymentType },
                            { txnType: txnType },
                          ],
                        })
                        .populate('payment')
                        .exec((error, result) => {
                          if (result == null) {
                            console.log({
                              msg: `No wallet history found `,
                              error,
                            })
                            res
                              .status(400)
                              .json({ msg: `No wallet history found`, error })
                          } else {
                            console.log({ msg: `Wallet fetched `, result })
                            res
                              .status(200)
                              .json({ msg: `Wallet fetched `, result })
                          }
                        })
                    } else {
                      const checkNull = [
                        walletId,
                        paymentId,
                        paymentType,
                      ].every(
                        (element) => element === null || element === undefined,
                      )

                      // filter by txn type and date
                      if (txnType && fromDate && toDate && checkNull) {
                        walletHistoryModel
                          .find({
                            $and: [
                              { txnType: txnType },
                              { updatedAt: { $gte: fromDate } },
                              { updatedAt: { $lte: toDate } },
                            ],
                          })
                          .populate('payment')
                          .exec((error, result) => {
                            if (result == null) {
                              console.log({
                                msg: `No wallet history found `,
                                error,
                              })
                              res
                                .status(400)
                                .json({ msg: `No wallet history found`, error })
                            } else {
                              console.log({ msg: `Wallet fetched `, result })
                              res
                                .status(200)
                                .json({ msg: `Wallet fetched `, result })
                            }
                          })
                      } else {
                        const checkNull = [walletId, paymentId, txnType].every(
                          (element) =>
                            element === null || element === undefined,
                        )

                        // filter by payment type and date
                        if (paymentType && fromDate && toDate && checkNull) {
                          walletHistoryModel
                            .find({
                              $and: [
                                { paymentType: paymentType },
                                { updatedAt: { $gte: fromDate } },
                                { updatedAt: { $lte: toDate } },
                              ],
                            })
                            .populate('payment')
                            .exec((error, result) => {
                              if (result == null) {
                                console.log({
                                  msg: `No wallet history found `,
                                  error,
                                })
                                res.status(400).json({
                                  msg: `No wallet history found`,
                                  error,
                                })
                              } else {
                                console.log({ msg: `Wallet fetched `, result })
                                res
                                  .status(200)
                                  .json({ msg: `Wallet fetched `, result })
                              }
                            })
                        } else {
                          const checkNull = [walletId, paymentId].every(
                            (element) =>
                              element === null || element === undefined,
                          )

                          // filter by txn type, payment type, and date
                          if (
                            txnType &&
                            paymentType &&
                            fromDate &&
                            toDate &&
                            checkNull
                          ) {
                            walletHistoryModel
                              .find({
                                $and: [
                                  { txnType: txnType },
                                  { paymentType: paymentType },
                                  { updatedAt: { $gte: fromDate } },
                                  { updatedAt: { $lte: toDate } },
                                ],
                              })
                              .populate('payment')
                              .exec((error, result) => {
                                if (result == null) {
                                  console.log({
                                    msg: `No wallet history found `,
                                    error,
                                  })
                                  res.status(400).json({
                                    msg: `No wallet history found`,
                                    error,
                                  })
                                } else {
                                  console.log({
                                    msg: `Wallet fetched `,
                                    result,
                                  })
                                  res
                                    .status(200)
                                    .json({ msg: `Wallet fetched `, result })
                                }
                              })
                          } else {
                            const checkNull = [txnType, paymentType].every(
                              (element) =>
                                element === null || element === undefined,
                            )

                            // filter by wallet id, payment id , and date
                            if (
                              walletId &&
                              paymentId &&
                              fromDate &&
                              toDate &&
                              checkNull
                            ) {
                              walletHistoryModel
                                .aggregate([
                                  {
                                    $lookup: {
                                      from: 'payments',
                                      localField: 'payment',
                                      foreignField: '_id',
                                      as: 'paymentResult',
                                    },
                                  },
                                ])
                                .exec((error, results) => {
                                  if (results == null) {
                                    console.log({
                                      msg: `No wallet history found `,
                                      error,
                                    })
                                    res.status(400).json({
                                      msg: `No wallet history found`,
                                      error,
                                    })
                                  } else {
                                    let result = results.find(
                                      (wallet) =>
                                        wallet.paymentResult[0].paymentId ==
                                        paymentId,
                                    )
                                    const { payment } = result

                                    walletHistoryModel
                                      .find({
                                        $and: [
                                          { walletId: walletId },
                                          { payment: payment },
                                          { updatedAt: { $gte: fromDate } },
                                          { updatedAt: { $lte: toDate } },
                                        ],
                                      })
                                      .populate('payment')
                                      .exec((error, result) => {
                                        if (result == null) {
                                          console.log({
                                            msg: `No wallet history found `,
                                            error,
                                          })
                                          res.status(400).json({
                                            msg: `No wallet history found`,
                                            error,
                                          })
                                        } else {
                                          console.log({
                                            msg: `Wallet fetched `,
                                            result,
                                          })
                                          res.status(200).json({
                                            msg: `Wallet fetched `,
                                            result,
                                          })
                                        }
                                      })
                                  }
                                })
                            } else {
                              const checkNull = [
                                paymentId,
                                fromDate,
                                toDate,
                              ].every(
                                (element) =>
                                  element === null || element === undefined,
                              )

                              // filter by wallet id, txn type, and payment type
                              if (
                                walletId &&
                                txnType &&
                                paymentType &&
                                checkNull
                              ) {
                                walletHistoryModel
                                  .find({
                                    $and: [
                                      { walletId: walletId },
                                      { txnType: txnType },
                                      { paymentType: paymentType },
                                    ],
                                  })
                                  .populate('payment')
                                  .exec((error, result) => {
                                    if (result == null) {
                                      console.log({
                                        msg: `No wallet history found `,
                                        error,
                                      })
                                      res.status(400).json({
                                        msg: `No wallet history found`,
                                        error,
                                      })
                                    } else {
                                      console.log({
                                        msg: `Wallet fetched `,
                                        result,
                                      })
                                      res.status(200).json({
                                        msg: `Wallet fetched `,
                                        result,
                                      })
                                    }
                                  })
                              } else {
                                const checkNull = [paymentId, txnType].every(
                                  (element) =>
                                    element === null || element === undefined,
                                )

                                // filter by wallet id, payment type, and date
                                if (
                                  walletId &&
                                  paymentType &&
                                  fromDate &&
                                  toDate &&
                                  checkNull
                                ) {
                                  walletHistoryModel
                                    .find({
                                      $and: [
                                        { walletId: walletId },
                                        { paymentType: paymentType },
                                        { updatedAt: { $gte: fromDate } },
                                        { updatedAt: { $lte: toDate } },
                                      ],
                                    })
                                    .populate('payment')
                                    .exec((error, result) => {
                                      if (result == null) {
                                        console.log({
                                          msg: `No wallet history found `,
                                          error,
                                        })
                                        res.status(400).json({
                                          msg: `No wallet history found`,
                                          error,
                                        })
                                      } else {
                                        console.log({
                                          msg: `Wallet fetched `,
                                          result,
                                        })
                                        res.status(200).json({
                                          msg: `Wallet fetched `,
                                          result,
                                        })
                                      }
                                    })
                                } else {
                                  const checkNull = [
                                    paymentId,
                                    paymentType,
                                  ].every(
                                    (element) =>
                                      element === null || element === undefined,
                                  )

                                  // filter by wallet id, txn type, and date
                                  if (
                                    walletId &&
                                    txnType &&
                                    fromDate &&
                                    toDate &&
                                    checkNull
                                  ) {
                                    walletHistoryModel
                                      .find({
                                        $and: [
                                          { walletId: walletId },
                                          { txnType: txnType },
                                          { updatedAt: { $gte: fromDate } },
                                          { updatedAt: { $lte: toDate } },
                                        ],
                                      })
                                      .populate('payment')
                                      .exec((error, result) => {
                                        if (result == null) {
                                          console.log({
                                            msg: `No wallet history found `,
                                            error,
                                          })
                                          res.status(400).json({
                                            msg: `No wallet history found`,
                                            error,
                                          })
                                        } else {
                                          console.log({
                                            msg: `Wallet fetched `,
                                            result,
                                          })
                                          res.status(200).json({
                                            msg: `Wallet fetched `,
                                            result,
                                          })
                                        }
                                      })
                                  } else {
                                    console.log({
                                      msg: `Invalid filter parameter selected`,
                                    })
                                    res.status(400).json({
                                      msg: `Invalid filter parameter selected`,
                                    })
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const filterForDownload = async (req, res) => {
  const {
    walletId,
    paymentId,
    txnType,
    paymentType,
    fromDate,
    toDate,
  } = req.body

  const checkNull = [paymentId, txnType, paymentType, fromDate, toDate].every(
    (element) => element === null || element === undefined,
  )
  // filter by wallet Id
  if (walletId && checkNull) {
    walletHistoryModel
      .find({ walletId: walletId })
      .populate('payment')
      .exec((error, request) => {
        if (request == null) {
          console.log({ msg: `No wallet history found `, error })
          res.status(400).json({ msg: `No wallet history found`, error })
        } else {
          // for (let index = 0; index < request.length; index++) {

          //   return result
          // }

          var result = request.map((element, index) => {
            var {
              walletId,
              payment,
              amount,
              paymentRef,
              paymentType,
              txnType,
              balanceBefore,
              walletBalance,
              createdAt,
              updatedAt,
            } = element

            var result = {
              ...result,
              walletId: walletId,
              paymentId: payment?.paymentId,
              feeId: payment,
              amount: amount,
              paymentRef: paymentRef,
              txnType: txnType,
              bankCredited: payment?.bankName,
              narration: payment?.narration,
              senderAcct: payment?.payeeName,
              paymentType: paymentType,
              balanceBefore: balanceBefore,
              balanceAfter: walletBalance,
              createdAt: createdAt,
              updatedAt: updatedAt,
            }

            return result
          })

          console.log({ msg: `Wallet fetched `, result })
          res.status(200).json({ msg: `Wallet fetched `, result })
        }
      })
  } else {
    const checkNull = [walletId, txnType, paymentType, fromDate, toDate].every(
      (element) => element === null || element === undefined,
    )
    // filter by payment
    if (paymentId && checkNull) {
      walletHistoryModel
        .aggregate([
          {
            $lookup: {
              from: 'payments',
              localField: 'payment',
              foreignField: '_id',
              as: 'paymentrequest',
            },
          },
        ])
        .exec((error, requests) => {
          if (requests == null) {
            console.log({ msg: `No wallet history found `, error })
            res.status(400).json({ msg: `No wallet history found`, error })
          } else {
            let request = requests.find(
              (wallet) => wallet.paymentrequest[0].paymentId == paymentId,
            )
            const { payment } = request
            walletHistoryModel
              .find({ payment: payment })
              .populate('payment')
              .exec((error, request) => {
                if (request == null) {
                  console.log({ msg: `No wallet history found `, error })
                  res
                    .status(400)
                    .json({ msg: `No wallet history found`, error })
                } else {
                  var result = request.map((element, index) => {
                    var {
                      walletId,
                      payment,
                      amount,
                      paymentRef,
                      paymentType,
                      txnType,
                      balanceBefore,
                      walletBalance,
                      createdAt,
                      updatedAt,
                    } = element

                    var result = {
                      ...result,
                      walletId: walletId,
                      paymentId: payment?.paymentId,
                      feeId: payment,
                      amount: amount,
                      paymentRef: paymentRef,
                      txnType: txnType,
                      bankCredited: payment?.bankName,
                      narration: payment?.narration,
                      senderAcct: payment?.payeeName,
                      paymentType: paymentType,
                      balanceBefore: balanceBefore,
                      balanceAfter: walletBalance,
                      createdAt: createdAt,
                      updatedAt: updatedAt,
                    }

                    return result
                  })

                  console.log({ msg: `Wallet fetched `, result })
                  res.status(200).json({ msg: `Wallet fetched `, result })
                }
              })

            // console.log({ msg: `Wallet fetched `, request: [request] })
            // res.status(200).json({ msg: `Wallet fetched `, request: [request] })
          }
        })
    } else {
      const checkNull = [
        walletId,
        paymentId,
        paymentType,
        fromDate,
        toDate,
      ].every((element) => element === null || element === undefined)

      // filter by txn type
      if (txnType && checkNull) {
        walletHistoryModel
          .find({ txnType: txnType })
          .populate('payment')
          .exec((error, request) => {
            if (request == null) {
              console.log({ msg: `No wallet history found `, error })
              res.status(400).json({ msg: `No wallet history found`, error })
            } else {
              var result = request.map((element, index) => {
                var {
                  walletId,
                  payment,
                  amount,
                  paymentRef,
                  paymentType,
                  txnType,
                  balanceBefore,
                  walletBalance,
                  createdAt,
                  updatedAt,
                } = element

                var result = {
                  ...result,
                  walletId: walletId,
                  paymentId: payment?.paymentId,
                  feeId: payment,
                  amount: amount,
                  paymentRef: paymentRef,
                  txnType: txnType,
                  bankCredited: payment?.bankName,
                  narration: payment?.narration,
                  senderAcct: payment?.payeeName,
                  paymentType: paymentType,
                  balanceBefore: balanceBefore,
                  balanceAfter: walletBalance,
                  createdAt: createdAt,
                  updatedAt: updatedAt,
                }

                return result
              })

              console.log({ msg: `Wallet fetched `, result })
              res.status(200).json({ msg: `Wallet fetched `, result })
            }
          })
      } else {
        const checkNull = [
          walletId,
          paymentId,
          txnType,
          fromDate,
          toDate,
        ].every((element) => element === null || element === undefined)

        // filter by payment type
        if (paymentType && checkNull) {
          walletHistoryModel
            .find({ paymentType: paymentType })
            .populate('payment')
            .exec((error, request) => {
              if (request == null) {
                console.log({ msg: `No wallet history found `, error })
                res.status(400).json({ msg: `No wallet history found`, error })
              } else {
                var result = request.map((element, index) => {
                  var {
                    walletId,
                    payment,
                    amount,
                    paymentRef,
                    paymentType,
                    txnType,
                    balanceBefore,
                    walletBalance,
                    createdAt,
                    updatedAt,
                  } = element

                  var result = {
                    ...result,
                    walletId: walletId,
                    paymentId: payment?.paymentId,
                    feeId: payment,
                    amount: amount,
                    paymentRef: paymentRef,
                    txnType: txnType,
                    bankCredited: payment?.bankName,
                    narration: payment?.narration,
                    senderAcct: payment?.payeeName,
                    paymentType: paymentType,
                    balanceBefore: balanceBefore,
                    balanceAfter: walletBalance,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                  }

                  return result
                })

                console.log({ msg: `Wallet fetched `, result })
                res.status(200).json({ msg: `Wallet fetched `, result })
              }
            })
        } else {
          const checkNull = [walletId, paymentId, txnType, paymentType].every(
            (element) => element === null || element === undefined,
          )

          // filter by date
          if (fromDate && toDate && checkNull) {
            walletHistoryModel
              .find({
                $and: [
                  { updatedAt: { $gte: fromDate } },
                  { updatedAt: { $lte: toDate } },
                ],
              })
              .populate('payment')
              .exec((error, request) => {
                if (request == null) {
                  console.log({ msg: `No wallet history found `, error })
                  res
                    .status(400)
                    .json({ msg: `No wallet history found`, error })
                } else {
                  var result = request.map((element, index) => {
                    var {
                      walletId,
                      payment,
                      amount,
                      paymentRef,
                      paymentType,
                      txnType,
                      balanceBefore,
                      walletBalance,
                      createdAt,
                      updatedAt,
                    } = element

                    var result = {
                      ...result,
                      walletId: walletId,
                      feeId: payment,
                      paymentId: payment?.paymentId,
                      amount: amount,
                      paymentRef: paymentRef,
                      txnType: txnType,
                      bankCredited: payment?.bankName,
                      narration: payment?.narration,
                      senderAcct: payment?.payeeName,
                      paymentType: paymentType,
                      balanceBefore: balanceBefore,
                      balanceAfter: walletBalance,
                      createdAt: createdAt,
                      updatedAt: updatedAt,
                    }

                    return result
                  })

                  console.log({ msg: `Wallet fetched `, result })
                  res.status(200).json({ msg: `Wallet fetched `, result })
                }
              })
          } else {
            const checkNull = [paymentId, txnType, paymentType].every(
              (element) => element === null || element === undefined,
            )

            // filter by wallet Id and date
            if (walletId && fromDate && toDate && checkNull) {
              walletHistoryModel
                .find({
                  $and: [
                    { walletId: walletId },
                    { updatedAt: { $gte: fromDate } },
                    { updatedAt: { $lte: toDate } },
                  ],
                })
                .populate('payment')
                .exec((error, request) => {
                  if (request == null) {
                    console.log({ msg: `No wallet history found `, error })
                    res
                      .status(400)
                      .json({ msg: `No wallet history found`, error })
                  } else {
                    var result = request.map((element, index) => {
                      var {
                        walletId,
                        payment,
                        amount,
                        paymentRef,
                        paymentType,
                        txnType,
                        balanceBefore,
                        walletBalance,
                        createdAt,
                        updatedAt,
                      } = element

                      var result = {
                        ...result,
                        walletId: walletId,
                        paymentId: payment?.paymentId,
                        feeId: payment,
                        amount: amount,
                        paymentRef: paymentRef,
                        txnType: txnType,
                        bankCredited: payment?.bankName,
                        narration: payment?.narration,
                        senderAcct: payment?.payeeName,
                        paymentType: paymentType,
                        balanceBefore: balanceBefore,
                        balanceAfter: walletBalance,
                        createdAt: createdAt,
                        updatedAt: updatedAt,
                      }

                      return result
                    })

                    console.log({ msg: `Wallet fetched `, result })
                    res.status(200).json({ msg: `Wallet fetched `, result })
                  }
                })
            } else {
              const checkNull = [walletId, txnType, paymentType].every(
                (element) => element === null || element === undefined,
              )

              // filter by payment Id and date
              if (paymentId && fromDate && toDate && checkNull) {
                walletHistoryModel
                  .aggregate([
                    {
                      $lookup: {
                        from: 'payments',
                        localField: 'payment',
                        foreignField: '_id',
                        as: 'paymentrequest',
                      },
                    },
                  ])
                  .exec((error, requests) => {
                    if (requests == null) {
                      console.log({ msg: `No wallet history found `, error })
                      res
                        .status(400)
                        .json({ msg: `No wallet history found`, error })
                    } else {
                      let request = requests.find(
                        (wallet) =>
                          wallet.paymentrequest[0].paymentId == paymentId,
                      )
                      const { payment } = request

                      walletHistoryModel
                        .find({
                          $and: [
                            { payment: payment },
                            { updatedAt: { $gte: fromDate } },
                            { updatedAt: { $lte: toDate } },
                          ],
                        })
                        .populate('payment')
                        .exec((error, request) => {
                          if (request == null) {
                            console.log({
                              msg: `No wallet history found `,
                              error,
                            })
                            res
                              .status(400)
                              .json({ msg: `No wallet history found`, error })
                          } else {
                            var result = request.map((element, index) => {
                              var {
                                walletId,
                                payment,
                                amount,
                                paymentRef,
                                paymentType,
                                txnType,
                                balanceBefore,
                                walletBalance,
                                createdAt,
                                updatedAt,
                              } = element

                              var result = {
                                ...result,
                                walletId: walletId,
                                paymentId: payment?.paymentId,
                                feeId: payment,
                                amount: amount,
                                paymentRef: paymentRef,
                                txnType: txnType,
                                bankCredited: payment?.bankName,
                                narration: payment?.narration,
                                senderAcct: payment?.payeeName,
                                paymentType: paymentType,
                                balanceBefore: balanceBefore,
                                balanceAfter: walletBalance,
                                createdAt: createdAt,
                                updatedAt: updatedAt,
                              }

                              return result
                            })

                            console.log({ msg: `Wallet fetched `, result })
                            res
                              .status(200)
                              .json({ msg: `Wallet fetched `, result })
                          }
                        })
                    }
                  })
              } else {
                const checkNull = [
                  paymentId,
                  paymentType,
                  fromDate,
                  toDate,
                ].every((element) => element === null || element === undefined)

                // filter by wallet Id and txn type
                if (walletId && txnType && checkNull) {
                  walletHistoryModel
                    .find({
                      $and: [{ walletId: walletId }, { txnType: txnType }],
                    })
                    .populate('payment')
                    .exec((error, request) => {
                      if (request == null) {
                        console.log({ msg: `No wallet history found `, error })
                        res
                          .status(400)
                          .json({ msg: `No wallet history found`, error })
                      } else {
                        var result = request.map((element, index) => {
                          var {
                            walletId,
                            payment,
                            amount,
                            paymentRef,
                            paymentType,
                            txnType,
                            balanceBefore,
                            walletBalance,
                            createdAt,
                            updatedAt,
                          } = element

                          var result = {
                            ...result,
                            walletId: walletId,
                            paymentId: payment?.paymentId,
                            feeId: payment,
                            amount: amount,
                            paymentRef: paymentRef,
                            txnType: txnType,
                            bankCredited: payment?.bankName,
                            narration: payment?.narration,
                            senderAcct: payment?.payeeName,
                            paymentType: paymentType,
                            balanceBefore: balanceBefore,
                            balanceAfter: walletBalance,
                            createdAt: createdAt,
                            updatedAt: updatedAt,
                          }

                          return result
                        })

                        console.log({ msg: `Wallet fetched `, result })
                        res.status(200).json({ msg: `Wallet fetched `, result })
                      }
                    })
                } else {
                  const checkNull = [
                    paymentId,
                    txnType,
                    fromDate,
                    toDate,
                  ].every(
                    (element) => element === null || element === undefined,
                  )

                  // filter by wallet Id and payment type
                  if (walletId && paymentType && checkNull) {
                    walletHistoryModel
                      .find({
                        $and: [
                          { walletId: walletId },
                          { paymentType: paymentType },
                        ],
                      })
                      .populate('payment')
                      .exec((error, request) => {
                        if (request == null) {
                          console.log({
                            msg: `No wallet history found `,
                            error,
                          })
                          res
                            .status(400)
                            .json({ msg: `No wallet history found`, error })
                        } else {
                          var result = request.map((element, index) => {
                            var {
                              walletId,
                              payment,
                              amount,
                              paymentRef,
                              paymentType,
                              txnType,
                              balanceBefore,
                              walletBalance,
                              createdAt,
                              updatedAt,
                            } = element

                            var result = {
                              ...result,
                              walletId: walletId,
                              paymentId: payment?.paymentId,
                              feeId: payment,
                              amount: amount,
                              paymentRef: paymentRef,
                              txnType: txnType,
                              bankCredited: payment?.bankName,
                              narration: payment?.narration,
                              senderAcct: payment?.payeeName,
                              paymentType: paymentType,
                              balanceBefore: balanceBefore,
                              balanceAfter: walletBalance,
                              createdAt: createdAt,
                              updatedAt: updatedAt,
                            }

                            return result
                          })

                          console.log({ msg: `Wallet fetched `, result })
                          res
                            .status(200)
                            .json({ msg: `Wallet fetched `, result })
                        }
                      })
                  } else {
                    const checkNull = [
                      walletId,
                      paymentId,
                      fromDate,
                      toDate,
                    ].every(
                      (element) => element === null || element === undefined,
                    )

                    // filter by payment type and txn type
                    if (paymentType && txnType && checkNull) {
                      walletHistoryModel
                        .find({
                          $and: [
                            { paymentType: paymentType },
                            { txnType: txnType },
                          ],
                        })
                        .populate('payment')
                        .exec((error, request) => {
                          if (request == null) {
                            console.log({
                              msg: `No wallet history found `,
                              error,
                            })
                            res
                              .status(400)
                              .json({ msg: `No wallet history found`, error })
                          } else {
                            var result = request.map((element, index) => {
                              var {
                                walletId,
                                payment,
                                amount,
                                paymentRef,
                                paymentType,
                                txnType,
                                balanceBefore,
                                walletBalance,
                                createdAt,
                                updatedAt,
                              } = element

                              var result = {
                                ...result,
                                walletId: walletId,
                                paymentId: payment?.paymentId,
                                feeId: payment,
                                amount: amount,
                                paymentRef: paymentRef,
                                txnType: txnType,
                                bankCredited: payment?.bankName,
                                narration: payment?.narration,
                                senderAcct: payment?.payeeName,
                                paymentType: paymentType,
                                balanceBefore: balanceBefore,
                                balanceAfter: walletBalance,
                                createdAt: createdAt,
                                updatedAt: updatedAt,
                              }

                              return result
                            })

                            console.log({ msg: `Wallet fetched `, result })
                            res
                              .status(200)
                              .json({ msg: `Wallet fetched `, result })
                          }
                        })
                    } else {
                      const checkNull = [
                        walletId,
                        paymentId,
                        paymentType,
                      ].every(
                        (element) => element === null || element === undefined,
                      )

                      // filter by txn type and date
                      if (txnType && fromDate && toDate && checkNull) {
                        walletHistoryModel
                          .find({
                            $and: [
                              { txnType: txnType },
                              { updatedAt: { $gte: fromDate } },
                              { updatedAt: { $lte: toDate } },
                            ],
                          })
                          .populate('payment')
                          .exec((error, request) => {
                            if (request == null) {
                              console.log({
                                msg: `No wallet history found `,
                                error,
                              })
                              res
                                .status(400)
                                .json({ msg: `No wallet history found`, error })
                            } else {
                              var result = request.map((element, index) => {
                                var {
                                  walletId,
                                  payment,
                                  amount,
                                  paymentRef,
                                  paymentType,
                                  txnType,
                                  balanceBefore,
                                  walletBalance,
                                  createdAt,
                                  updatedAt,
                                } = element

                                var result = {
                                  ...result,
                                  walletId: walletId,
                                  paymentId: payment?.paymentId,
                                  feeId: payment,
                                  amount: amount,
                                  paymentRef: paymentRef,
                                  txnType: txnType,
                                  bankCredited: payment?.bankName,
                                  narration: payment?.narration,
                                  senderAcct: payment?.payeeName,
                                  paymentType: paymentType,
                                  balanceBefore: balanceBefore,
                                  balanceAfter: walletBalance,
                                  createdAt: createdAt,
                                  updatedAt: updatedAt,
                                }

                                return result
                              })

                              console.log({ msg: `Wallet fetched `, result })
                              res
                                .status(200)
                                .json({ msg: `Wallet fetched `, result })
                            }
                          })
                      } else {
                        const checkNull = [walletId, paymentId, txnType].every(
                          (element) =>
                            element === null || element === undefined,
                        )

                        // filter by payment type and date
                        if (paymentType && fromDate && toDate && checkNull) {
                          walletHistoryModel
                            .find({
                              $and: [
                                { paymentType: paymentType },
                                { updatedAt: { $gte: fromDate } },
                                { updatedAt: { $lte: toDate } },
                              ],
                            })
                            .populate('payment')
                            .exec((error, request) => {
                              if (request == null) {
                                console.log({
                                  msg: `No wallet history found `,
                                  error,
                                })
                                res.status(400).json({
                                  msg: `No wallet history found`,
                                  error,
                                })
                              } else {
                                var result = request.map((element, index) => {
                                  var {
                                    walletId,
                                    payment,
                                    amount,
                                    paymentRef,
                                    paymentType,
                                    txnType,
                                    balanceBefore,
                                    walletBalance,
                                    createdAt,
                                    updatedAt,
                                  } = element

                                  var result = {
                                    ...result,
                                    walletId: walletId,
                                    paymentId: payment?.paymentId,
                                    feeId: payment,
                                    amount: amount,
                                    paymentRef: paymentRef,
                                    txnType: txnType,
                                    bankCredited: payment?.bankName,
                                    narration: payment?.narration,
                                    senderAcct: payment?.payeeName,
                                    paymentType: paymentType,
                                    balanceBefore: balanceBefore,
                                    balanceAfter: walletBalance,
                                    createdAt: createdAt,
                                    updatedAt: updatedAt,
                                  }

                                  return result
                                })

                                console.log({ msg: `Wallet fetched `, result })
                                res
                                  .status(200)
                                  .json({ msg: `Wallet fetched `, result })
                              }
                            })
                        } else {
                          const checkNull = [walletId, paymentId].every(
                            (element) =>
                              element === null || element === undefined,
                          )

                          // filter by txn type, payment type, and date
                          if (
                            txnType &&
                            paymentType &&
                            fromDate &&
                            toDate &&
                            checkNull
                          ) {
                            walletHistoryModel
                              .find({
                                $and: [
                                  { txnType: txnType },
                                  { paymentType: paymentType },
                                  { updatedAt: { $gte: fromDate } },
                                  { updatedAt: { $lte: toDate } },
                                ],
                              })
                              .populate('payment')
                              .exec((error, request) => {
                                if (request == null) {
                                  console.log({
                                    msg: `No wallet history found `,
                                    error,
                                  })
                                  res.status(400).json({
                                    msg: `No wallet history found`,
                                    error,
                                  })
                                } else {
                                  var result = request.map((element, index) => {
                                    var {
                                      walletId,
                                      payment,
                                      amount,
                                      paymentRef,
                                      paymentType,
                                      txnType,
                                      balanceBefore,
                                      walletBalance,
                                      createdAt,
                                      updatedAt,
                                    } = element

                                    var result = {
                                      ...result,
                                      walletId: walletId,
                                      paymentId: payment?.paymentId,
                                      feeId: payment,
                                      amount: amount,
                                      paymentRef: paymentRef,
                                      txnType: txnType,
                                      bankCredited: payment?.bankName,
                                      narration: payment?.narration,
                                      senderAcct: payment?.payeeName,
                                      paymentType: paymentType,
                                      balanceBefore: balanceBefore,
                                      balanceAfter: walletBalance,
                                      createdAt: createdAt,
                                      updatedAt: updatedAt,
                                    }

                                    return result
                                  })

                                  console.log({
                                    msg: `Wallet fetched `,
                                    result,
                                  })
                                  res
                                    .status(200)
                                    .json({ msg: `Wallet fetched `, result })
                                }
                              })
                          } else {
                            const checkNull = [txnType, paymentType].every(
                              (element) =>
                                element === null || element === undefined,
                            )

                            // filter by wallet id, payment id , and date
                            if (
                              walletId &&
                              paymentId &&
                              fromDate &&
                              toDate &&
                              checkNull
                            ) {
                              walletHistoryModel
                                .aggregate([
                                  {
                                    $lookup: {
                                      from: 'payments',
                                      localField: 'payment',
                                      foreignField: '_id',
                                      as: 'paymentrequest',
                                    },
                                  },
                                ])
                                .exec((error, requests) => {
                                  if (requests == null) {
                                    console.log({
                                      msg: `No wallet history found `,
                                      error,
                                    })
                                    res.status(400).json({
                                      msg: `No wallet history found`,
                                      error,
                                    })
                                  } else {
                                    let request = requests.find(
                                      (wallet) =>
                                        wallet.paymentrequest[0].paymentId ==
                                        paymentId,
                                    )
                                    const { payment } = request

                                    walletHistoryModel
                                      .find({
                                        $and: [
                                          { walletId: walletId },
                                          { payment: payment },
                                          { updatedAt: { $gte: fromDate } },
                                          { updatedAt: { $lte: toDate } },
                                        ],
                                      })
                                      .populate('payment')
                                      .exec((error, request) => {
                                        if (request == null) {
                                          console.log({
                                            msg: `No wallet history found `,
                                            error,
                                          })
                                          res.status(400).json({
                                            msg: `No wallet history found`,
                                            error,
                                          })
                                        } else {
                                          var result = request.map(
                                            (element, index) => {
                                              var {
                                                walletId,
                                                payment,
                                                amount,
                                                paymentRef,
                                                paymentType,
                                                txnType,
                                                balanceBefore,
                                                walletBalance,
                                                createdAt,
                                                updatedAt,
                                              } = element

                                              var result = {
                                                ...result,
                                                walletId: walletId,
                                                paymentId: payment?.paymentId,
                                                feeId: payment,
                                                amount: amount,
                                                paymentRef: paymentRef,
                                                txnType: txnType,
                                                bankCredited: payment?.bankName,
                                                narration: payment?.narration,
                                                senderAcct: payment?.payeeName,
                                                paymentType: paymentType,
                                                balanceBefore: balanceBefore,
                                                balanceAfter: walletBalance,
                                                createdAt: createdAt,
                                                updatedAt: updatedAt,
                                              }

                                              return result
                                            },
                                          )

                                          console.log({
                                            msg: `Wallet fetched `,
                                            result,
                                          })
                                          res.status(200).json({
                                            msg: `Wallet fetched `,
                                            result,
                                          })
                                        }
                                      })
                                  }
                                })
                            } else {
                              const checkNull = [
                                paymentId,
                                fromDate,
                                toDate,
                              ].every(
                                (element) =>
                                  element === null || element === undefined,
                              )

                              // filter by wallet id, txn type, and payment type
                              if (
                                walletId &&
                                txnType &&
                                paymentType &&
                                checkNull
                              ) {
                                walletHistoryModel
                                  .find({
                                    $and: [
                                      { walletId: walletId },
                                      { txnType: txnType },
                                      { paymentType: paymentType },
                                    ],
                                  })
                                  .populate('payment')
                                  .exec((error, request) => {
                                    if (request == null) {
                                      console.log({
                                        msg: `No wallet history found `,
                                        error,
                                      })
                                      res.status(400).json({
                                        msg: `No wallet history found`,
                                        error,
                                      })
                                    } else {
                                      var result = request.map(
                                        (element, index) => {
                                          var {
                                            walletId,
                                            payment,
                                            amount,
                                            paymentRef,
                                            paymentType,
                                            txnType,
                                            balanceBefore,
                                            walletBalance,
                                            createdAt,
                                            updatedAt,
                                          } = element

                                          var result = {
                                            ...result,
                                            walletId: walletId,
                                            paymentId: payment?.paymentId,
                                            feeId: payment,
                                            amount: amount,
                                            paymentRef: paymentRef,
                                            txnType: txnType,
                                            bankCredited: payment?.bankName,
                                            narration: payment?.narration,
                                            senderAcct: payment?.payeeName,
                                            paymentType: paymentType,
                                            balanceBefore: balanceBefore,
                                            balanceAfter: walletBalance,
                                            createdAt: createdAt,
                                            updatedAt: updatedAt,
                                          }

                                          return result
                                        },
                                      )

                                      console.log({
                                        msg: `Wallet fetched `,
                                        result,
                                      })
                                      res.status(200).json({
                                        msg: `Wallet fetched `,
                                        result,
                                      })
                                    }
                                  })
                              } else {
                                const checkNull = [paymentId, txnType].every(
                                  (element) =>
                                    element === null || element === undefined,
                                )

                                // filter by wallet id, payment type, and date
                                if (
                                  walletId &&
                                  paymentType &&
                                  fromDate &&
                                  toDate &&
                                  checkNull
                                ) {
                                  walletHistoryModel
                                    .find({
                                      $and: [
                                        { walletId: walletId },
                                        { paymentType: paymentType },
                                        { updatedAt: { $gte: fromDate } },
                                        { updatedAt: { $lte: toDate } },
                                      ],
                                    })
                                    .populate('payment')
                                    .exec((error, request) => {
                                      if (request == null) {
                                        console.log({
                                          msg: `No wallet history found `,
                                          error,
                                        })
                                        res.status(400).json({
                                          msg: `No wallet history found`,
                                          error,
                                        })
                                      } else {
                                        var result = request.map(
                                          (element, index) => {
                                            var {
                                              walletId,
                                              payment,
                                              amount,
                                              paymentRef,
                                              paymentType,
                                              txnType,
                                              balanceBefore,
                                              walletBalance,
                                              createdAt,
                                              updatedAt,
                                            } = element

                                            var result = {
                                              ...result,
                                              walletId: walletId,
                                              paymentId: payment?.paymentId,
                                              feeId: payment,
                                              amount: amount,
                                              paymentRef: paymentRef,
                                              txnType: txnType,
                                              bankCredited: payment?.bankName,
                                              narration: payment?.narration,
                                              senderAcct: payment?.payeeName,
                                              paymentType: paymentType,
                                              balanceBefore: balanceBefore,
                                              balanceAfter: walletBalance,
                                              createdAt: createdAt,
                                              updatedAt: updatedAt,
                                            }

                                            return result
                                          },
                                        )

                                        console.log({
                                          msg: `Wallet fetched `,
                                          result,
                                        })
                                        res.status(200).json({
                                          msg: `Wallet fetched `,
                                          result,
                                        })
                                      }
                                    })
                                } else {
                                  const checkNull = [
                                    paymentId,
                                    paymentType,
                                  ].every(
                                    (element) =>
                                      element === null || element === undefined,
                                  )

                                  // filter by wallet id, txn type, and date
                                  if (
                                    walletId &&
                                    txnType &&
                                    fromDate &&
                                    toDate &&
                                    checkNull
                                  ) {
                                    walletHistoryModel
                                      .find({
                                        $and: [
                                          { walletId: walletId },
                                          { txnType: txnType },
                                          { updatedAt: { $gte: fromDate } },
                                          { updatedAt: { $lte: toDate } },
                                        ],
                                      })
                                      .populate('payment')
                                      .exec((error, request) => {
                                        if (request == null) {
                                          console.log({
                                            msg: `No wallet history found `,
                                            error,
                                          })
                                          res.status(400).json({
                                            msg: `No wallet history found`,
                                            error,
                                          })
                                        } else {
                                          var result = request.map(
                                            (element, index) => {
                                              var {
                                                walletId,
                                                payment,
                                                amount,
                                                paymentRef,
                                                paymentType,
                                                txnType,
                                                balanceBefore,
                                                walletBalance,
                                                createdAt,
                                                updatedAt,
                                              } = element

                                              var result = {
                                                ...result,
                                                walletId: walletId,
                                                paymentId: payment?.paymentId,
                                                feeId: payment,
                                                amount: amount,
                                                paymentRef: paymentRef,
                                                txnType: txnType,
                                                bankCredited: payment?.bankName,
                                                narration: payment?.narration,
                                                senderAcct: payment?.payeeName,
                                                paymentType: paymentType,
                                                balanceBefore: balanceBefore,
                                                balanceAfter: walletBalance,
                                                createdAt: createdAt,
                                                updatedAt: updatedAt,
                                              }

                                              return result
                                            },
                                          )

                                          console.log({
                                            msg: `Wallet fetched `,
                                            result,
                                          })
                                          res.status(200).json({
                                            msg: `Wallet fetched `,
                                            result,
                                          })
                                        }
                                      })
                                  } else {
                                    console.log({
                                      msg: `Invalid filter parameter selected`,
                                    })
                                    res.status(400).json({
                                      msg: `Invalid filter parameter selected`,
                                    })
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const aggregateBalance = async (req, res) => {
  walletHistoryModel.aggregate(
    [
      {
        $group: { _id: '$paymentType', aggBalance: { $sum: '$walletBalance' } },
      },
    ],
    (err, result) => {
      if (err) {
        console.log({ msg: 'No wallet record found', err })
        res.status(400).json({ msg: 'No wallet record found', err })
      } else {
        console.log({ msg: 'Aggregate Balance fetched ', result })
        res.status(200).json({ msg: 'Aggregate Balance fetched', result })
      }
    },
  )
}

// const debitWallet2 = async (req, res) => {
//   const { studentId } = req.params
//   walletHistoryModel.findOneAndUpdate(
//     { studentId: studentId },
//     req.body,
//     { new: true, runValidators: true },
//     (error, result) => {
//       if (error) {
//         console.log({
//           msg: `Failed to debit wallet `,
//           error,
//         })
//         res.status(400).json({
//           msg: `Failed to debit wallet `,
//           error,
//         })
//       } else {
//         console.log({
//           msg: `Wallet debited successfully`,
//           result,
//         })
//         res.status(200).json({
//           msg: `Wallet debited successfully `,
//           result,
//         })
//       }
//     },
//   )
// }

const debitWallet = async (req, res) => {
  const {
    walletId,
    payment,
    amount,
    paymentRef,
    txnType,
    balanceBefore,
    walletBalance,
  } = req.body

  const paymentType = 'debit'

  walletHistoryModel.find({ paymentRef: paymentRef }, (err, result) => {
    if (result?.length > 0) {
      console.log({
        msg: 'Payment already exist on wallet history',
        result,
      })
      res.status(400).json({ msg: 'Payment already exist on wallet history' })
    } else {
      walletHistoryModel.create(
        {
          walletId,
          payment,
          amount,
          paymentRef,
          paymentType,
          txnType,
          balanceBefore,
          walletBalance,
        },
        (error, data) => {
          if (err) {
            console.log({
              msg: `Failed to debit wallet `,
              error,
            })
            res.status(400).json({
              msg: `Failed to debit wallet `,
              error,
            })
          } else {
            console.log({
              msg: `Wallet debited successfully`,
              result,
            })
            res.status(200).json({
              msg: `Wallet debited successfully `,
              result,
            })
          }
        },
      )
    }
  })
}

const delWallet = async (req, res) => {
  const { studentId } = req.params
  walletHistoryModel.findOneAndDelete(
    { studentId: studentId },
    (error, result) => {
      if (error) {
        console.log({
          msg: `Failed to close wallet `,
          error,
        })
        res.status(400).json({
          msg: `Failed to close wallet  `,
          error,
        })
      } else {
        console.log({
          msg: `Wallet closed successfully`,
          result,
        })
        res.status(200).json({
          msg: `Wallet closed successfully `,
          result,
        })
      }
    },
  )
}

module.exports = {
  fundWallet,
  studentWalletHistory,
  walletBalance,
  adminWalletHistory,
  filterWalletHistory,
  filterForDownload,
  aggregateBalance,
  debitWallet,
  delWallet,
}
