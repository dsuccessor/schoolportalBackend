const feeListModel = require('../models/feeListModel')

const configureFee = async (req, res) => {
  const { feeCategory, session, dueFees, feeName, amount } = req.body

  feeListModel.find(
    {
      $and: [{ feeCategory: feeCategory }, { session: session }],
    },
    (error, result) => {
      if (result.length > 0) {
        console.log({ msg: 'Fee already configured', checkIfExist })
        res.status(400).json({ msg: 'Fee already configured', checkIfExist })
      } else {
        feeListModel.create(
          {
            feeCategory: feeCategory,
            session: session,
            dueFees: dueFees,
            feeName: feeName,
            amount: amount,
          },
          (error, result) => {
            if (error) {
              console.log({ msg: 'Fee configuration failed', error })
              res.status(400).json({ msg: 'Fee configuration failed', error })
            } else {
              console.log({ msg: 'Fee configured successfully', result })
              res
                .status(200)
                .json({ msg: 'Fee configured successfully', result })
            }
          },
        )
      }
    },
  )
}

const getConfiguredFee = (req, res) => {
  let { feeCategory, session } = req.params

  session = session?.split('-')[0].concat('/', session?.split('-')[1])

  // console.log(feeCategory, mysession)

  feeListModel.findOne(
    {
      $and: [{ feeCategory: feeCategory }, { session: session }],
    },
    (error, result) => {
      if (error || result?.length < 1 || result === null) {
        console.log({ msg: 'Unable to fetch fee', error })
        res.status(400).json({ msg: 'Unable to fetch fee', error })
      } else {
        console.log({ msg: 'Fee configured fetched successfully', result })
        res
          .status(200)
          .json({ msg: 'Fee configured fetched successfully', result })
      }
    },
  )
}

module.exports = { configureFee, getConfiguredFee }
