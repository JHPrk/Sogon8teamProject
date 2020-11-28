var express = require('express');
var router = express.Router();
var debug = require('./debugTool');
var db_utils = require('./db_utils');

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
		return res.send('already logged in')
	}

	db_utils.find_user(userid,function(err, userInfo) {
		if (err)
		{
			return res.send(err)
		}
		if(userInfo == 0)
		{
			return res.send('no data found!')
		}
		db_utils.login_user(userid,password, function(err, result) {
		if (result == 0)
		{
			return res.send('no password match')
		}
			res.cookie('name', userInfo.name, {
			    maxAge: 60*60*1000,
			    httpOnly: true,
    			path:'/visitors'
			});
			return res.send(userInfo);
		});
	  
	});
});

router.post('/out', function(req,res,next){
	res.clearCookie('name', {path: '/visitors'})
})

router.get('/assign', function(req,res,next){
	
})
module.exports = router;
