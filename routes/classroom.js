var express = require('express');
var router = express.Router();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs')
var debug = require('./debugTool');
var db_utils = require('./db_utils');
	
/* GET home page. */
router.post('/', function(req, res, next) {
	var data = ''
	var title = req.body.name;
	var menu_list = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/menu_list.ejs'), 'utf8'), {academic : req.body.academic, classname : title})
	data = req.cookies.name;
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data})
	if(!req.cookies.name)
	{
		return res.redirect('../?a=로그인을 해주세요!')
	}
	debug.log(title);
	var lectures = [];
	var events = [];
	var notify = [];
	if (req.cookies.gradeInfo < 0)
	{
		db_utils.findClassLecture(req.body.academic, function(err,results){
			if (err)
			{
				return res.render('error',err);
			}
			if(results != 0)
			{
				for (let i = 0; i < results.length; i++)
				{
					oneLecture = [];
					oneLecture.push(results[i].lectureno);
					oneLecture.push(results[i].name);
					oneLecture.push(results[i].lecturestart);
					oneLecture.push('보기')
					lectures.push(oneLecture);
				}
			}
			findUserClassTestAssignment(req.body.academic, function(err,events){
				if (err)
				{
					return res.render('error',err);
				}

				res.render('classroom',{loginBox : loginInfo, menuList : menu_list, title : title, lectures : lectures, events : events, notify : notify});
				
			});
		});
	}
	else
	{
		db_utils.findStudentLectureAttandance(req.cookies.userid, req.body.academic, function(err,results){
			oneLecture = [];
			if (err)
			{
				return res.render('error',err);
			}
			if(results != 0)
			{
				for (let i = 0; i < results.length; i++)
				{
					oneLecture = [];
					oneLecture.push(results[i].lectureno);
					oneLecture.push(results[i].name);
					oneLecture.push(results[i].lecturestart);
					if(results[i].attandancetype == 0)
					{
						oneLecture.push('미처리')
					}
					else if(results[i].attandancetype == 1)
					{
						oneLecture.push('출석')
					}
					else if(results[i].attandancetype == 2)
					{
						oneLecture.push('지각')
					}
					else if(results[i].attandancetype == 3)
					{
						oneLecture.push('결석')
					}
					lectures.push(oneLecture);
					debug.log(oneLecture);
				}
			}
			findUserClassTestAssignment(req.body.academic, function(err,events){
				if (err)
				{
					return res.render('error',err);
				}
				res.render('classroom',{loginBox : loginInfo, menuList : menu_list, title : title, lectures : lectures, events : events, notify : notify});
			});
		});
	}
});


var findUserClassTestAssignment = function(academic, callback){
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
				onetest = ['시험'];
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
					oneAssignments = ['과제'];
					oneAssignments.push(assignments[i].name);
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



module.exports = router;
