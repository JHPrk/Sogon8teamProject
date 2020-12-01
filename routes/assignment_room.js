var express = require('express');
var router = express.Router();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs')
var debug = require('./debugTool');
var db_utils = require('./db_utils');

/* GET home page. */
router.get('/', function(req, res, next) {
	var name = req.cookies.name
	
	res.sendFile(path.resolve(__dirname + '/../views/assignmentroom.html'));
});
router.post('/detail', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/assignment_detail.html'));
});
router.post('/enroll', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/assignment_enroll.html'));
});

router.post('/upload', function(req, res, next) {
	var data = ''
	var title = req.body.name;
	var menu_list = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/menu_list.ejs'), 'utf8'), {academic : req.body.academic, classname : title});
	data = req.cookies.name;
	if (req.cookies.gradeInfo < 0)
	{
		data += ' 교수';
	}
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data});
	res.render('assignment_upload',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title});
	
});

module.exports = router;
