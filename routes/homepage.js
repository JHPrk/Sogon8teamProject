var express = require('express');
var router = express.Router();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs')
var debug = require('./debugTool');
	
/* GET home page. */
router.get('/', function(req, res, next) {
	var data = ''
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_box.ejs'), 'utf8'), {})
	var popup = '';
	if(req.cookies.name)
	{
		data = req.cookies.name
		loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data})
	}
	var msg = req.query.a
	debug.log(msg);

	if(msg)
	{
		popup = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/popup.ejs'), 'utf8'), {message: msg})
	}
	res.render('index',{loginBox : loginInfo, popupAlert : popup});
});

module.exports = router;
