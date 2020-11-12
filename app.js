var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socketio = require('./routes/socketio');


var homepage = require('./routes/homepage')
var classroom = require('./routes/classroom')
var assignment_room = require('./routes/assignment_room')
var login = require('./routes/login')
var grade_report = require('./routes/grade_report')
var chatting_room = require('./routes/chatting_room')
var qna_room = require('./routes/qna_room')

var cors = require('cors');
var app = express();

app.set('port',3000);// //52270
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homepage);
app.use('/classroom', classroom)
app.use('/assignment', assignment_room)
app.use('/login', login)
app.use('/grade', grade_report)
app.use('/chatting', chatting_room)
app.use('/qna', qna_room)

var server = http.createServer(app);
socketio.setServerToIO(server);
var runServer = server.listen(app.get('port'),function(){
  console.log('Server:'+ app.get('port') +  ' is running');
});
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

module.exports = app;