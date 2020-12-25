const express = require("express")
const validationRules = require("../middlewares/validationRules")
const validate = require("../middlewares/validate")
const isLoggedIn = require("../middlewares/authorization")
const {
    createTodo,
    editTodo,
    deleteTodo,
    fetchTodo,
    fetchAll
} = require("../controllers/todoController.js");

const router = express.Router();

router.use(isLoggedIn)

router.post("/",
//   validationRules('createTodo'),
//   validate,
  createTodo
)

router.put("/:id",
//   validationRules('editTodo'),
  validate,
  editTodo
)

router.delete("/:id", deleteTodo)

router.get("/:id", fetchTodo)

router.get("/", fetchAll)

module.exports = router;