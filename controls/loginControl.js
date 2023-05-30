const adminModel = require('../models/adminModel')

const loginUser = async (req, res) => {
  const { email, password } = req.body

  const checkIfExist = await adminModel.findOne(
    { email, password },
    'surname otherName email passport role userId',
  )
  if (checkIfExist) {
    console.log({ msg: 'Login Access Granted', checkIfExist })
    res.status(200).json({ msg: 'Login Access Granted', checkIfExist })
  } else {
    console.log({ msg: 'Login Access Denied' })
    res
      .status(400)
      .json({ msg: 'Login Access Denied!, Invalid user credentials' })
  }
}

module.exports = loginUser
