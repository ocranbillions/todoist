const express = require("express")

const router = express.Router();

const db = [];

router.get("/", (req, res) => {

    
    res.send("get todos")
})

router.post("/todo", (req, res) => {

})

router.put("/todo", (req, res) => {

})

router.delete("/todo", (req, res) => {

})

module.exports = router;