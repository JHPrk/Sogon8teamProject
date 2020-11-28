var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/attendance', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/grade_attendance.html'));
});
router.get('/homework', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/grade_homework.html'));
});
router.get('/test', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/grade_test.html'));
});

module.exports = router;
