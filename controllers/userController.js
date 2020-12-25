const signUp = (req, res) => {
  const {email, password} = req.body;
  try {

    return res.status(201).json({
      success: true,
      data: "data"
    })

  }catch(error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    })
  }
}

const signIn = (req, res) => {
  const {email, password} = req.body;
  try {

    return res.status(200).json({
      success: true,
      data: "data"
    })

  }catch(error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    })
  }
}

module.exports = {
  signUp,
  signIn
}