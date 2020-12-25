const express = require("express")
const {signUp, signIn} = require("../controllers/userController.js");
const userValidationRules = require("../middlewares/userValidationRules")
const validate = require("../middlewares/validate")

const router = express.Router();

const db = [];

router.post("/signup",
  userValidationRules('signup'),
  validate,
  signUp
)

router.post("/signin",
  userValidationRules('signin'),
  validate,
  signIn
)

module.exports = router;