var express = require('express');
var router = express.Router();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs')
	
/* GET home page. */
router.get('/', function(req, res, next) {
	var data = ''
	var menu_list = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/menu_list.ejs'), 'utf8'), {})
	data = req.cookies.name
	var loginInfo = ejs.render(fs.readFileSync(path.resolve(__dirname + '/../views/login_display.ejs'), 'utf8'), {name: data})
	if(!req.cookies.name)
	{
		return res.redirect('../?a=로그인을 해주세요!')
	}
	res.render('classroom',{loginBox : loginInfo, menuList : menu_list});
});

module.exports = router;
