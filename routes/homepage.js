var express = require('express');
var router = express.Router();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs')
var debug = require('./debugTool');
var db_utils = require('./db_utils');

var findClassTestAssignment = function(academic, callback){
	events = [];
	db_utils.findClassTest(academic, function(err,tests){
		if (err)
		{
			return callback(err);
		}
		if (tests != 0)
		{
			for (let i = 0; i < tests.length; i++)
			{
				onetest = [];
				if(tests[i].type == 0)
				{
					onetest.push('퀴즈');
				}
				if(tests[i].type == 1)
				{
					onetest.push('중간고사');
				}
				if(tests[i].type == 2)
				{
					onetest.push('기말고사');
				}
				onetest.push(tests[i].title);
				debug.log('시간 : ' + tests[i].startdate);
				let dateTimeParts= tests[i].startdate.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
				dateTimeParts[1]--;
				onetest.push(dateTimeParts);
				events.push(onetest);
			}
		}
		db_utils.findClassAssignment(academic, function(err,assignments){
			if (err)
			{
				return callback(err);
			}
			if (assignments != 0)
			{
				for(let i = 0; i < assignments.length; i++)
				{
					oneAssignments = [];
					oneAssignments.push(assignments[i].name);
					oneAssignments.push(assignments[i].discription);
					let dateTimeParts= assignments[i].duedate.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
					dateTimeParts[1]--;
					oneAssignments.push(dateTimeParts);
					events.push(oneAssignments);
				}
				return callback(null,events)
			}
			return callback(null,events);
		});
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {
	var data = ''
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_box.ejs'), 'utf8'), {})
	var popup = '';
	var classes = ['먼저 로그인 해주세요.'];
	var events = [];
	var loggedin = false;
	var msg = req.query.a
	debug.log(msg);
	if(msg)
	{
		popup = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/popup.ejs'), 'utf8'), {message: msg})
	}
	if(req.cookies.name)
	{
		loggedin = true;
		data = req.cookies.name;
		if (req.cookies.gradeInfo < 0)
			data += ' 교수';
		loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data})
		debug.log(req.cookies.userid + req.cookies.gradeInfo);
		db_utils.findUserClass(req.cookies.userid, req.cookies.gradeInfo, function(err, result){
			classes = [];
			academic = [];
			if (err)
			{
				return res.render('error',err);
			}
			if (result != 0)
			{
				for (let i = 0; i < result.length; i++)
				{
					classes.push(result[i].classname);
					academic.push(result[i].academic);
				}
				findClassTestAssignment(academic, function(err,results){
					if (err)
					{
						return res.render('error',err);
					}
					res.render('index',{loginBox : loginInfo, popupAlert : popup, 
						classes : classes, 
						academic : academic,
						events : results});
				});
			}
			else
			{
				res.render('index',{loginBox : loginInfo, popupAlert : popup, 
					classes : classes, 
					academic : academic,
					events : events});
			}
		});
		//[['기말고사','소프트웨어 공학','2020,10,30,16,30'],['기말고사','소프트웨어 공학','2020,10,30,18,0']]
		//events = db_utils.findUserEvents(req.cookies.userid);
	}
	if(!loggedin)
	{
		res.render('index',{loginBox : loginInfo, popupAlert : popup, 
			classes : [], 
			academic : [],
			events : []});
	}
});

module.exports = router;
