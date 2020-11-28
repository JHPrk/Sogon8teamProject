var express = require('express');
var router = express.Router();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs')
	
/* GET home page. */
router.get('/', function(req, res, next) {
	var data = ''
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_box.ejs'), 'utf8'), {})
	if(req.cookies.name)
	{
		data = req.cookies.name
		loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data})
	}
	res.render('index',{loginBox : loginInfo});
});

module.exports = router;
