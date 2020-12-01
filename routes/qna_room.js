var express = require('express');
var router = express.Router();
var path = require('path');
var ejs = require('ejs');
var fs = require('fs')
var debug = require('./debugTool');
var db_utils = require('./db_utils');

/* GET home page. */
router.post('/', function(req, res, next) {
	var data = ''
	var title = req.body.name;
	var academic = req.body.academic;
	var menu_list = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/menu_list.ejs'), 'utf8'), {academic : req.body.academic, classname : title})
	data = req.cookies.name
	if (req.cookies.gradeInfo < 0)
	{
		data += ' 교수';
	}
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data})
	if(!req.cookies.name)
	{
		return res.redirect('../?a=로그인을 해주세요!')
	}
	db_utils.qnaLists(req.body.academic, function(err,results)
	{
		qnalists = []
		if(err)
		{
			return res.render('error',err);
		}
		if (results == 0)
			return res.render('qna_question_list',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, qnalists : []});
		for (let i = 0; i < results.length; i++)
		{
			oneVal = [];
			oneVal.push(results[i].qna_no);
			oneVal.push(results[i].title);
			oneVal.push(results[i].writer);
			qnalists.push(oneVal);
		}		
		res.render('qna_question_list',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, qnalists : qnalists});

	});

});
router.post('/upload', function(req, res, next) {
	var data = ''
	var title = req.body.name;
	var academic = req.body.academic;
	var menu_list = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/menu_list.ejs'), 'utf8'), {academic : req.body.academic, classname : title})
	data = req.cookies.name
	if (req.cookies.gradeInfo < 0)
	{
		data += ' 교수';
	}
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data})
	if(!req.cookies.name)
	{
		return res.redirect('/?a=로그인을 해주세요!')
	}
	debug.log(req.body)
	res.render('qna_question_upload',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title});
});
router.post('/content', function(req, res, next) {
	var data = ''
	var title = req.body.name;
	var academic = req.body.academic;
	var menu_list = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/menu_list.ejs'), 'utf8'), {academic : req.body.academic, classname : title})
	data = req.cookies.name
	if (req.cookies.gradeInfo < 0)
	{
		data += ' 교수';
	}
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data})
	if(!req.cookies.name)
	{
		return res.redirect('../?a=로그인을 해주세요!')
	}
	res.render('qna_question_content',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title});
});

module.exports = router;
