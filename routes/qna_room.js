var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/qna_question_list.html'));
});
router.get('/upload', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/qna_question_upload.html'));
});
router.get('/content', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname + '/../views/qna_question_content.html'));
});

module.exports = router;
