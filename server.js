require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');
const amqp = require('amqplib/callback_api');
const userService = require('./users/user.service');
const passport = require('passport');
const session = require('express-session')
const axios = require("axios");
require('./passport-setup');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin:"*"}));


app.use(session({
   secret: '-------',
   resave: false,
   saveUninitialized: true,
   cookie: { secure: true }
}));



// api routes
app.use('/', require('./users/users.controller'));

// global error handler
app.use(errorHandler);
app.post("/signup-with-recaptcha", async (req, res, next) => {
  if (!req.body.cToken) {
      return res.status(400).json({ error: "reCaptcha token is missing" });
  }

  try {
      const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=6LcjiY4iAAAAADUjiTnlM08iEW68tCfXepKuIyXI&response=${req.body.cToken}`;
      const response = await axios.post(googleVerifyUrl);
      const { success } = response.data;
      if (success) {
          //Do sign up and store user in database
          return res.json({ success: true });
      } else {
          return res
              .status(400)
              .json({ error: "Invalid Captcha. Try again." });
      }
  } catch (e) {
      return res.status(400).json({ error: "reCaptcha error." });
  }
});

// start server
// amqp.connect('amqp://localhost', (err, connection)=> {
//     if (err) {
//       throw err;
//     }
//     connection.createChannel((error, channel)=> {
//       if (error) {
//         throw error;
//       }
//       var queueName = 'new-user';
  
//       channel.assertQueue(queueName,  {
//         durable: false
//       });
//      channel.consume(queueName,(msg)=>{
//     // let data=JSON.parse(msg.content)
//     // data
//     userService.create(JSON.parse(msg?.content))
//       channel.ack(msg)
//      })
//     });

//     connection.createChannel((error, channel)=> {
//       if (error) {
//         throw error;
//       }
//       var queueName = 'update-user';
  
//       channel.assertQueue(queueName,  {
//         durable: false
//       });
//      channel.consume(queueName,(msg)=>{
//       let data=JSON.parse(msg?.content)
//     userService.update(data.email, data)
//       channel.ack(msg)
//      })
//     });
  
//   });
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(4000, () => console.log('Server listening on port ' + port));