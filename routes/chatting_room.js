var express = require('express');
var router = express.Router();
var path = require('path')

/* GET chatting Room List. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../views/chatting_list.html'));
});

router.get('/room', function(req,res,next){
	res.sendFile(path.resolve(__dirname + '/../views/chattingroom.html'));
});
module.exports = router;
