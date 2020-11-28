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
	debug.log(userid);
	debug.log(password);
	debug.log(req.cookies.name)
	if(req.cookies.name)
	{
		return res.redirect('../');
	}

	db_utils.find_user(userid,function(err, userInfo) {
		if (err)
		{
			return res.render('error',err);
		}
		if(userInfo == 0)
		{
			return res.render('login_failed',{text:'없는 아이디입니다!'});
		}
		db_utils.login_user(userid,password, function(err, result) {
		if (result == 0)
		{
			return res.render('login_failed',{text:'비밀번호가 틀렸습니다!'});
		}
		res.cookie('name', userInfo.name, {
		    maxAge: 60*60*1000,
		    httpOnly: true
		});
		return res.redirect('../');
		});
	});
});

router.get('/out', function(req,res,next){
	res.clearCookie('name');
	res.redirect('../../');
})

router.get('/assign', function(req,res,next){
	
})
module.exports = router;
