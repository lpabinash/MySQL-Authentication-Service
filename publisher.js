var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection)=> {
  if (err) {
    throw err;
  }
  connection.createChannel((error, channel)=> {
    if (error) {
      throw error;
    }
    var queueName = 'update-user';
    var msg = {
        "email": "testing09876.n@gmail.com",
        "password": "pass12345"
    };

    channel.assertQueue(queueName,  {
      durable: false
    });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)));
    console.log(msg)
    setTimeout(()=>{
        connection.close()
    },1000)
  });

});