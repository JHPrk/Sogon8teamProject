var express = require('express');
var router = express.Router();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs')
var debug = require('./debugTool');
var db_utils = require('./db_utils');

router.post('/attendance/put', function(req,res,next){
	debug.log(req.body);
	var lectureno = req.body.lectureno;
	var academic = req.body.academic;
	var attendanceType = [];
	var userid = [];
	for (var key in req.body)
	{
		if (key == 'lectureno' || key == 'academic' || key == 'name')
		{
			continue;
		}
		userid.push(key);
		if (req.body[key] == '출석')
			attendanceType.push(1);
		else if (req.body[key] == '지각')
			attendanceType.push(2);
		else if (req.body[key] == '결석')
			attendanceType.push(3);
		else if (req.body[key] == '미처리')
			attendanceType.push(0);
	}
	db_utils.updateStudentAttendance(attendanceType, userid, academic, lectureno, function(err,result){
		if(err)
		{
			return res.render('error',err);
		}
		res.redirect(307,'.');
	});
});
/* GET home page. */
router.post('/attendance', function(req, res, next) {
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
	if (req.cookies.gradeInfo < 0)
	{
		lectureno = req.body.lectureno;
		debug.log('lecture : ' + lectureno);
		debug.log(req.body);
		if (lectureno == null)
		{
			lectureno = 1;
		}
		lectureLists = [];
		attendancesList = [];
		debug.log('in');
		db_utils.findLectureAttandance(academic, lectureno, function(err,results)
		{
			if(err)
			{
				return res.render('error',err);
			}
			if(results != 0)
			{
				for (let i = 0; i < results.length; i++)
				{
					oneVal = [];
					oneVal.push(results[i].student_user_id);
					oneVal.push(results[i].major);
					oneVal.push(results[i].student_name);
					oneVal.push(results[i].grade);
					oneVal.push(results[i].attandancetype);
					attendancesList.push(oneVal);
				}
				db_utils.getLectureLists(academic, function(err,result){
					if(err)
					{
						return res.render('error',err);
					}
					for (let i = 0; i < result.length; i++)
					{
						onelecture = [];
						onelecture.push(result[i].lectureno);
						onelecture.push(result[i].name);
						lectureLists.push(onelecture);
					}
					var grade_table = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/grade_manager_attendance.ejs'), 'utf8'), {attendances : attendancesList, lectures : lectureLists, selected : lectureno, title : title, academic : academic})
					res.render('grade_attendance',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, gradeTable : grade_table});
				});
			}
		});
	}
	else
	{
		attendancesList = [];
		db_utils.findStudentLectureAttandance(req.cookies.userid, req.body.academic, function(err,results)
		{
			if(err)
			{
				return res.render('error',err);
			}
			if(results != 0)
			{
				for (let i = 0; i < results.length; i++)
				{
					oneVal = [];
					oneVal.push(results[i].lectureno);
					oneVal.push(results[i].name);
					oneVal.push(results[i].lecturestart);
					oneVal.push(results[i].attandancetype);
					attendancesList.push(oneVal);
				}
				var grade_table = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/grade_attendance_table.ejs'), 'utf8'), {attendances : attendancesList});
				res.render('grade_attendance',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, gradeTable : grade_table});
			}
		});
	}
});


router.post('/homework/put', function(req,res,next){
	debug.log(req.body);
	var academicno = req.body.academicno;
	var academic = req.body.academic;
	var score = [];
	var userid = [];
	for (var key in req.body)
	{
		if (key == 'assignmentno' || key == 'academic' || key == 'name')
		{
			continue;
		}
		if (req.body[key] == '')
			continue;
		userid.push(key);
		score.push(req.body[key]);
	}
	debug.log(userid.length);
	if (userid.length == 0)
	{
		res.redirect(307,'.');
	}
	db_utils.updateStudentAssignment(score, userid, academic, academicno, function(err,result){
		if(err)
		{
			return res.render('error',err);
		}
		res.redirect(307,'.');
	});
});
router.post('/homework', function(req, res, next) {
	
	var data = ''
	var title = req.body.name;
	var menu_list = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/menu_list.ejs'), 'utf8'), {academic : req.body.academic, classname : title});
	data = req.cookies.name;
	if (req.cookies.gradeInfo < 0)
	{
		data += ' 교수';
	}
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data});
	if(!req.cookies.name)
	{
		return res.redirect('../?a=로그인을 해주세요!')
	}
	if (req.cookies.gradeInfo < 0)
	{
		var academic = req.body.academic;
		assignmentno = req.body.assignmentno;
		debug.log('assignment : ' + assignmentno);
		debug.log(req.body);
		if (assignmentno == null)
		{
			assignmentno = 1;
		}
		assignmentLists = [];
		studentUploaded = [];
		debug.log('in');
		db_utils.findAssignmentLists(academic, assignmentno, function(err,results)
		{
			if(err)
			{
				return res.render('error',err);
			}
			if(results  !=0)
			{
				for (let i = 0; i < results.length; i++)
				{
					oneVal = [];
					oneVal.push(results[i].major);
					oneVal.push(results[i].student_user_id);
					oneVal.push(results[i].student_name);
					oneVal.push(results[i].grade);
					if(results[i].score == null)
					{
						oneVal.push('미제출');
						oneVal.push('  ');
					}
					else
					{
						oneVal.push('제출');
						oneVal.push(results[i].score);
					}
					studentUploaded.push(oneVal);
				}
				db_utils.getAssignmentLists(academic, function(err,result){
					if(err)
					{
						return res.render('error',err);
					}
					for (let i = 0; i < result.length; i++)
					{
						onelecture = [];
						onelecture.push(result[i].assignmentno);
						onelecture.push(result[i].name);
						assignmentLists.push(onelecture);
					}
					var grade_table = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/grade_homework_manager_table.ejs'), 'utf8'), {assignments_names : assignmentLists, assignments : studentUploaded, selected : assignmentno, title : title, academic : academic})
					res.render('grade_homework',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, gradeTable : grade_table});
				});
			}
		});
	}
	else
	{
		attendancesList = [];
		db_utils.findStudentAssignmentClass(req.cookies.userid, req.body.academic, function(err,results)
		{
			if(err)
			{
				return res.render('error',err);
			}
			if(results != 0)
			{
				for (let i = 0; i < results.length; i++)
				{
					oneVal = [];
					oneVal.push(results[i].name);
					oneVal.push(results[i].duedate);
					if(results[i].score == null)
					{
						oneVal.push('미제출');
						oneVal.push('  ');
					}
					else
					{
						oneVal.push('제출');
						oneVal.push(results[i].score);
					}
					attendancesList.push(oneVal);
				}
				var grade_table = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/grade_homework_table.ejs'), 'utf8'), {attendances : attendancesList});
				res.render('grade_homework',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, gradeTable : grade_table});
			}
		});
	}

});
router.post('/test', function(req, res, next) {
	var data = ''
	var title = req.body.name;
	var menu_list = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/menu_list.ejs'), 'utf8'), {academic : req.body.academic, classname : title});
	data = req.cookies.name;
	if (req.cookies.gradeInfo < 0)
	{
		data += ' 교수';
	}
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data});
	if(!req.cookies.name)
	{
		return res.redirect('../?a=로그인을 해주세요!')
	}
	if (req.cookies.gradeInfo < 0)
	{
		var academic = req.body.academic;
		testtype = req.body.testtype;
		debug.log('assignment : ' + testtype);
		debug.log(req.body);
		if (testtype == null)
		{
			testtype = 1;
		}
		else if(testtype == '중간고사')
			testtype = 1;
		else if(testtype == '기말고사')
			testtype = 2;
		tests = [];
		debug.log('in');
		db_utils.findTestLists(academic, testtype, function(err,results)
		{
			if(err)
			{
				return res.render('error',err);
			}
			if(results  !=0)
			{
				for (let i = 0; i < results.length; i++)
				{
					oneVal = [];
					oneVal.push(results[i].major);
					oneVal.push(results[i].student_user_id);
					oneVal.push(results[i].name);
					oneVal.push(results[i].grade);
					if(results[i].totalscore == null)
					{
						oneVal.push('결석');
						oneVal.push('0');
					}
					else
					{
						oneVal.push('출석');
						oneVal.push(results[i].totalscore);
					}
					tests.push(oneVal);
				}
				debug.log(tests);
				var grade_table = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/grade_test_manager_table.ejs'), 'utf8'), {tests : tests, selected : testtype, title : title, academic : academic})
				res.render('grade_test',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, gradeTable : grade_table});
			}
		});
	}
	else
	{
		testresult = [];
		db_utils.findStudentTest(req.cookies.userid, req.body.academic, function(err,results)
		{
			if(err)
			{
				return res.render('error',err);
			}
			if(results != 0)
			{
				for (let i = 0; i < results.length; i++)
				{
					oneVal = [];
					if(results[i].type == 1)
					{
						oneVal.push('중간 고사');
					}
					else
					{
						oneVal.push('기말 고사');
					}
					oneVal.push(results[i].startdate);
					if(results[i].totalscore == null)
					{
						oneVal.push('결석');
						oneVal.push('0');
					}
					else
					{
						oneVal.push('출석');
						oneVal.push(results[i].totalscore);
					}
					testresult.push(oneVal);
				}
				var grade_table = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/grade_test_table.ejs'), 'utf8'), {tests : testresult});
				res.render('grade_test',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, gradeTable : grade_table});
			}
			else
			{
				var grade_table = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/grade_test_table.ejs'), 'utf8'), {tests : []});
				res.render('grade_test',{loginBox : loginInfo, menuList : menu_list, title : title, academic : req.body.academic, classname : title, gradeTable : grade_table});				
			}
		});
	}
});

router.post('/test/put', function(req,res,next){
	debug.log(req.body);
	if (req.body.testno == '중간고사')
		testno = 1;
	else
		testno = 2;
	var academic = req.body.academic;
	var score = [];
	var userid = [];
	for (var key in req.body)
	{
		if (key == 'testno' || key == 'academic' || key == 'name')
		{
			continue;
		}
		if (req.body[key] == '')
			continue;
		userid.push(key);
		score.push(req.body[key]);
	}
	debug.log(userid.length);
	if (userid.length == 0)
	{
		res.redirect(307,'.');
	}
	db_utils.updateStudentTests(score, userid, academic, testno, function(err,result){
		if(err)
		{
			return res.render('error',err);
		}
		res.redirect(307,'.');
	});
});

module.exports = router;
