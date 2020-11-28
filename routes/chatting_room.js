var express = require('express');
var router = express.Router();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs')
var debug = require('./debugTool');

/* GET chatting Room List. */
router.get('/', function(req, res, next) {
  	res.render('chatting_list',{data:['학생1','학생2']});
});

router.get('/room', function(req,res,next){
	res.sendFile(path.resolve(__dirname + '/../views/chattingroom.html'));
});
module.exports = router;
