const keepAwake = () => {
  setInterval(function() {
    console.log("stay awake!")
  }, 1500000);// every 25 minutes (1500000)
}

module.exports = keepAwake;