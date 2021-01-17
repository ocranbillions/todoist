const express = require("express")
const {signUp, signIn} = require("../controllers/userController.js");
const validationRules = require("../middlewares/validationRules")
const validate = require("../middlewares/validate")

const router = express.Router();

router.post("/signup",
  validationRules('signup'),
  validate,
  signUp
)

router.post("/signin",
  validationRules('signin'),
  validate,
  signIn
)

module.exports = router;