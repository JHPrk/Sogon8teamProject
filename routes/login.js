var express = require('express');
var router = express.Router();
var debug = require('./debugTool');
var db_utils = require('./db_utils');
var ejs = require('ejs')

/* GET home page. */
router.post('/', function(req, res, next) {
	debug.log(req.body);
	var userid = req.body.userid;
	var password = req.body.passwd;
	if(req.cookies.name)
	{
		return res.redirect('/');
	}

	db_utils.find_user(userid,function(err, userInfo) {
		if (err)
		{
			return res.render('error',err);
		}
		if(userInfo == 0)
		{
			return res.redirect('/?a=없는 아이디입니다!');
		}
		db_utils.login_user(userid,password, function(err, result) {
			if (result == 0)
			{
				return res.redirect('/?a=비밀번호가 틀렸습니다!');
			}
			res.cookie('name', userInfo.name, {
			    maxAge: 60*60*1000,
			    httpOnly: true
			});
			res.cookie('userid', userid, {
			    maxAge: 60*60*1000,
			    httpOnly: true
			});
			db_utils.isStudent(userid, function(err, gradeInfo){
				if (err)
				{
					return res.render('error',err);
				}
				if(gradeInfo == -1)
				{
					res.cookie('gradeInfo', -1, {
					    maxAge: 60*60*1000,
					    httpOnly: true
					});
					return res.redirect('/');
				}
				res.cookie('gradeInfo', gradeInfo.grade, {
				    maxAge: 60*60*1000,
				    httpOnly: true
				});
				return res.redirect('/');
			});
		});
	});
});

router.get('/out', function(req,res,next){
	res.clearCookie('name');
	res.clearCookie('gradeInfo');
	res.clearCookie('userid');
	res.redirect('../../');
})

router.get('/assign', function(req,res,next){
	
})
module.exports = router;
