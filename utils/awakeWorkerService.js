const http = require("http");
const awakeWorkerService = async() => {
    console.log("Waking up worker service...")
    await http.get("https://todoworker.herokuapp.com/");
    console.log("service up")
}

module.exports = awakeWorkerService;