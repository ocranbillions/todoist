const express = require("express");
const bodyParser = require('body-parser')
const todoRoutes = require("./routes/todoRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express();
app.use(bodyParser.json())
app.use("/auth", userRoutes)
app.use("/todo", todoRoutes)


app.get("/", (req, res) => {
  res.status(200).json({
    success:true,
    message: "Welcome to Todoist"
  })
})

app.all('*', (req, res) => {
  return res.status(404).json({
    errors: [{message: "Page not found"}]
  })
})

//Error handler
app.use((error, req, res, next) => {
  const env = process.env.NODE_ENV;
  if (env === 'development' || env === 'test') {
    console.log(error.stack)
    return res.status(500).json({
      errors: [{message: error.message}]
    })
  }

  return res.status(500).json({
    errors: [{message: "something went wrong"}]
  })
});

module.exports = app;
