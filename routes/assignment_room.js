var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/assignmentroom.html'));
});
router.get('/detail', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/assignment_detail.html'));
});
router.get('/enroll', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/assignment_enroll.html'));
});

router.get('/upload', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/assignment_upload.html'));
});

module.exports = router;
