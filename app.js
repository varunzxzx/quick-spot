var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();
dotenv.load();

var twilio = require('twilio');
var client = new twilio(process.env.SID, process.env.TOKEN);

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
    socket.emit('take id',{id: socket.id})
});

var googleMapsClient = require('@google/maps').createClient({
    key: process.env.API_KEY
});

app.post('/located',(req,res) => {
    if(!req.body.id) return res.status(400).json({success: false});
    var arr = [];
    arr.push(parseFloat(req.body.lat));
    arr.push(parseFloat(req.body.long))
    googleMapsClient.reverseGeocode({
        latlng: arr,
    },function(err, response) {
        if(err) {
            return res.status(400).send(err);
        }
        console.log(req.body.id)
        io.emit('located',{location: response.json.results[0],lat: req.body.lat,long: req.body.long})
        return res.status(200).send(response.json.results)
    })
});

app.post('/spot',(req,res) => {
  if(!req.body.id || !req.body.lat || !req.body.long) return res.status(400).json({success: false, msg: "Insufficient data"})

  var arr = [];
  arr.push(parseFloat(req.body.lat));
  arr.push(parseFloat(req.body.long))
  googleMapsClient.places({
    location: arr,
    radius: 4000,
    type: 'hospital'
  }, function(err, response) {
    if (!err) {
      var results = response.json.results;
      var addresses = [];
      var names = []
      for(var i=0;i<results.length;i++) {
        addresses.push(results[i].formatted_address)
        names.push(results[i].name)
      }
      googleMapsClient.reverseGeocode({
        latlng: arr,
      },function(err, response) {
        if(!err) {
            googleMapsClient.distanceMatrix({
                origins: response.json.results[0].formatted_address,
                destinations: addresses,
                departure_time: Date.now(),
                mode: 'driving',
                traffic_model: 'best_guess'
            },function(err, response) {
                var result = response.json.rows;
                var elements = (result[0].elements)
                var min = elements[0].duration.value;
                var x = 0;
                var text = "";
                console.log(elements)
                elements.map((element,i) => {
                    if(element.status === "OK") {
                        if(element.duration.value < min) {
                            min = element.duration.value;
                            text = element.duration.text;
                            x = i;
                        }
                    }
                })
                console.log(min)
                client.messages.create({
                    body: `${process.env.DOMAIN}/locate/${req.body.id}`,
                    to: '+917982023018',  // Text this number
                    from: '+13344215467' // From a valid Twilio number
                })
                    .then((message,err) => {console.log(message.sid)})
                    .catch(err => console.log(err));
                return res.status(200).json({minimum: min, address: addresses[x], name: names[x], duration: text})
            });
        }
      })
    }
  });
});

app.use('/locate/:id',express.static(path.join(__dirname, 'public/locate')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(3000, function(){
    console.log('listening on localhost:3000');
});