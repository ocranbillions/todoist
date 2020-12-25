const express = require("express");
const bodyParser = require('body-parser')
const todoRoutes = require("./routes/todoRoutes")
const userRoutes = require("./routes/userRoutes")


const app = express();
app.use(bodyParser.json())

app.use("/auth", userRoutes)
app.use("/todo", todoRoutes)

app.all('*', (req, res) => {
  return res.status(404).json({
    errors: [{message: "Page not found"}]
  })
})

//Error handler
app.use((error, req, res, next) => {
  const env = process.env.NODE_ENV;
  if (env === 'development' || env === 'test') {
    return res.status(500).json({
      errors: [{message: error.message}]
    })
  }

  return res.status(500).json({
    errors: [{message: "server error"}]
  })
});


app.listen(3000, () => {
  console.log("app is listening on port 3000")
})