const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./userRoutes/userRoutes');
const userRoutesTest = require('./userRoutes/userRoutesTest');
const staticRoutes = require('./userRoutes/staticRoutes');
const adminRoutes = require('./adminRoutes/adminRoutes');
const adminUserRoutes = require('./adminRoutes/userRoutes');
const adminStaticRoutes = require('./adminRoutes/staticRoutes');
const mcache = require('memory-cache');
const compression = require('compression')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan');
app.set('view engine', 'jade');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('combined'))
app.set('trust proxy', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const _ = require('lodash');
const expressValidator = require('express-validator');
require('./models/adminModel')
const https = require('https');
const fs = require('fs');
require('./models/userModel.js');
require('./models/productOrderModel.js');


mongoose.connect(`mongodb://127.0.0.1:27017/saveEat`, { useNewUrlParser: true }, (err, result) => {
  if (err) {
    console.log("Error in connecting with database")
  }
  else {
    console.log('Mongoose connecting is setup successfully')
  }
});

const httpsOptions = {
  'cert': fs.readFileSync('/var/www/certificate/saveeat.in/5ee13949fbaae688.crt'),
  'key': fs.readFileSync('/var/www/certificate/csr/csr.txt')
}


var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

process.on('uncaughtException', function (err) {
  console.log(err);
})

//=========================Terms & condition Html===================//

app.get('/terms', (req, res) => {
  res.sendFile(__dirname + '/view/terms.html')
});

//===========================About us Html=========================//

app.get('/aboutUs', (req, res) => {
  res.sendFile(__dirname + '/view/aboutUs.html')
});

//==========================Request Console=======================//

app.all("*", (req, resp, next) => {


  let obj = {
    Host: req.headers.host,
    ContentType: req.headers['content-type'],
    Url: req.originalUrl,
    Method: req.method,
    Query: req.query,
    Body: req.body,
    Parmas: req.params[0]
  }
  console.log("Common Request is===========>", [obj])
  next();
});


app.listen(3032, () => {
  console.log(`Save Eat listening on port 3032`);
})

var server = https.createServer(httpsOptions, app);
const io = require('socket.io')(server);
var sockets = {};
module.exports.sockets = sockets;

//===========================Socket===============================//

io.on('connection', function (socket) {
  console.log('socket connected', socket.id);

  //======================Room Join====================================//

  socket.on('roomJoin', function (msg) {
    console.log('roomJoin', msg);
    socket.join(msg, () => {
      io.to(msg).emit('roomJoin', { status: true, roomId: msg });
    });
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  //======================Room Leave==================================//

  socket.on('room leave', (msg) => {
    console.log('room leave', msg.roomId);
    socket.leave(msg.roomId, () => {
      io.to(msg.roomId).emit('room leave', { status: true, roomId: msg.roomId });
    });
  })


  //======================Typing stop================================//

  socket.on('typeOut', (msg) => {
    console.log('typeOut', msg.roomId);
    io.to(msg.roomId).emit('typeOut', msg);
  })

  //=====================Message send================================//

  socket.on('sendOrder', function (msg, callback) {
    console.log("Request for sendOrder is===========>", msg)
    io.to(msg.roomId).emit('sendOrder', msg);
  });
});


server.listen(3035, () => {
  console.log(`Server running on port 3035`);
})

app.use(cors());
app.use(expressValidator())
app.use(compression())
app.use('/api/v1/user', userRoutes);
app.use('/api/v2/user', userRoutesTest);
app.use('/api/v1/static', staticRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/adminUser', adminUserRoutes);
app.use('/api/v1/adminStatic', adminStaticRoutes);

app.use((req, res) => {
  res.status(404).send('')
})


server.timeout = 0;