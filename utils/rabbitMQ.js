const amqp = require('amqplib/callback_api');
const url = process.env.CLOUDAMQP_URL;

module.exports.sendQueue = (message, queue) => {
  return new Promise(async (resolve) => {
  amqp.connect(url, function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(queue, {
        durable: true
      });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true
      });
      resolve(`You have successfully invited ${message.friendsEmail} to view your todos; an email will be sent them`);
    });
  });
  })
}

