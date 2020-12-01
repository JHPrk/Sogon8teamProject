var express = require('express');
var debug = require('./debugTool');
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 3,
  host: "localhost",
  user: "root",
  password: "0000",
  port : 3306,
  database: "mydb",
  dateStrings: "date",
  multipleStatements: true
});

exports.updateStudentTests = function(score, userid, academic, testtype, callback){
  pool.getConnection(function(err,con){
    var statement = ''
    for(let i = 0; i < userid.length; i ++)
    {
      statement += 'UPDATE grade_report SET totalscore = ' + score[i] + ' WHERE student_user_id = '+ userid[i] + ' and classroom_academic = \'' + academic + '\' and test_id = ' + testtype + ';' 
    }
    debug.log(statement)
    con.query(statement
      , [], function(err, result){
      con.release();
      if(err)
      {
        debug.log('err : ' + err);
        return callback(err);
      }
      return callback(null, true);
    });
  });
}


exports.updateStudentAssignment = function(score, userid, academic, academicno, callback){
  pool.getConnection(function(err,con){
    var statement = ''
    for(let i = 0; i < userid.length; i ++)
    {
      statement += 'UPDATE uploaded_assignment SET score = ' + score[i] + ' WHERE student_user_id = '+ userid[i] + ' and classroom_academic = \'' + academic + '\' and assignmentno = ' + assignmentno + ';' 
    }
    debug.log(statement)
    con.query(statement
      , [], function(err, result){
      con.release();
      if(err)
      {
        debug.log('err : ' + err);
        return callback(err);
      }
      return callback(null, true);
    });
  });
}

exports.updateStudentAttendance = function(attendanceType, userid, academic, lectureno, callback){
  pool.getConnection(function(err,con){
    var statement = ''
    for(let i = 0; i < userid.length; i ++)
    {
      statement += 'UPDATE attandance SET attandancetype = ' + attendanceType[i] + ' WHERE student_user_id = '+ userid[i] + ' and classroom_academic = \'' + academic + '\' and lectureno = ' + lectureno + ';' 
    }
    debug.log(statement)
    con.query(statement
      , [], function(err, result){
      con.release();
      if(err)
      {
        debug.log('err : ' + err);
        return callback(err);
      }
      return callback(null, true);
    });
  });
}
exports.qnaLists = function(academic, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);    
    }
    con.query('SELECT qna_no,classroom_academic, writer, title, upload_date, content from qna where classroom_academic = ?', 
      [academic],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  });
}

exports.getAssignmentLists = function(academic, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);    
    }
    con.query('SELECT classroom_academic, assignmentno, name, duedate, startdate, discription from assignment where classroom_academic = ?', 
      [academic],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  });
}
exports.findTestLists = function(academic, testType, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT major, name, grade, student_classroom.student_user_id as student_user_id, test.classroom_academic as classroom_academic, test_no, totalscore, type, title, startdate, enddate FROM student_classroom LEFT OUTER JOIN student on student.user_id = student_classroom.student_user_id LEFT OUTER JOIN test on test.classroom_academic = student_classroom.classroom_academic LEFT OUTER JOIN grade_report on grade_report.classroom_academic = test.classroom_academic and grade_report.test_id = test.test_no and student_classroom.student_user_id = grade_report.student_user_id LEFT OUTER JOIN user on user.id = student_classroom.student_user_id where test.classroom_academic = ? and type = ?', 
      [academic, testType],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  });
}

exports.findStudentTest = function(userid , academic, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT student_classroom.student_user_id as student_user_id, test.classroom_academic as classroom_academic, test_no, totalscore, type, title, startdate, enddate FROM student_classroom LEFT OUTER JOIN test on test.classroom_academic = student_classroom.classroom_academic LEFT OUTER JOIN grade_report on grade_report.classroom_academic = test.classroom_academic and grade_report.test_id = test.test_no and student_classroom.student_user_id = grade_report.student_user_id where student_classroom.student_user_id = ? and test.classroom_academic = ?', 
      [userid, academic],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  });
}

exports.findAssignmentLists = function(academic, assignmentno, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT assignment.classroom_academic as classroom_academic, grade, assignment.assignmentno as assignmentno, student_classroom.STUDENT_USER_ID as student_user_id, major, user.name as student_name, score, content, assignment.name as assignment_name, duedate, startdate, discription FROM student_classroom LEFT OUTER JOIN student on student.user_id = student_classroom.student_user_id LEFT OUTER JOIN assignment on assignment.classroom_academic = student_classroom.classroom_academic LEFT OUTER JOIN uploaded_assignment on student_classroom.classroom_academic = uploaded_assignment.classroom_academic and assignment.assignmentno = uploaded_assignment.assignmentno and student_classroom.student_user_id = uploaded_assignment.student_user_id LEFT OUTER JOIN user on user.id = student_classroom.student_user_id where assignment.classroom_academic = ? and assignment.AssignmentNo = ?;', 
      [academic, assignmentno],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  });
}
exports.findStudentAssignmentClass = function(userid , academic, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT assignment.classroom_academic as classroom_academic, assignment.assignmentno as assignmentno, student_classroom.STUDENT_USER_ID as student_user_id, score, content, name, duedate, startdate, discription FROM student_classroom LEFT OUTER JOIN assignment on assignment.classroom_academic = student_classroom.classroom_academic LEFT OUTER JOIN uploaded_assignment on student_classroom.classroom_academic = uploaded_assignment.classroom_academic and assignment.assignmentno = uploaded_assignment.assignmentno and student_classroom.student_user_id = uploaded_assignment.student_user_id where assignment.classroom_academic = ? and student_classroom.student_user_id = ?', 
      [academic, userid],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  });
}

exports.findClassLecture = function(academic,callback){

    pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT classroom_academic, lectureno, name, lecturestart, lectureend FROM lecture where classroom_academic in (?)', 
      [academic],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  }); 
}
exports.getLectureLists = function(academic, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT classroom_academic, lectureno, name, lecturestart, lectureend from lecture where classroom_academic = ?', 
      [academic],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  });
}
exports.findLectureAttandance = function(academic,lectureno, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT student_user_id, major, user.name as student_name, grade, lecture.classroom_academic as academic, lecture.lectureno as lectureno, lecture.name as lecture_name, lecturestart, lectureend, attandancetype FROM lecture LEFT OUTER JOIN attandance on attandance.classroom_academic = lecture.classroom_academic and attandance.lectureno = lecture.lectureno LEFT OUTER JOIN student on student.user_id = attandance.student_user_id LEFT OUTER JOIN user on student.user_id = user.id where lecture.classroom_academic = ? and lecture.lectureno = ?', 
      [academic, lectureno],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  });
}
exports.findStudentLectureAttandance = function(userid, academic, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT STUDENT_USER_ID, lecture.classroom_academic as academic, lecture.lectureno as lectureno, name, lecturestart, lectureend, attandancetype FROM lecture left join attandance on attandance.classroom_academic = lecture.classroom_academic and attandance.lectureno = lecture.lectureno where student_user_id = ? and lecture.classroom_academic = ?', 
      [userid, academic],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  }); 
}

exports.findClassAssignment = function(academic,callback){

    pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT classroom_academic, assignmentno, name, duedate, startdate, discription FROM assignment where classroom_academic in (?)', 
      [academic],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  }); 
}

exports.findClassTest = function(academic,callback){

  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT classroom_academic, test_no, type, title, startdate, enddate FROM test where classroom_academic in (?)', 
      [academic],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));

        return callback(null, rows);
    });
  }); 
}

exports.findUserClass = function(userId, grade, callback){
  if (grade == -1){
    pool.getConnection(function (err, con) {
      // Use the connection
      if (err){
        return callback(err);
      }
      con.query('SELECT academic, classname, academic from classroom where professor_user_id = ?', 
        [userId],
        function (err, rows) {
          con.release(); // Don't use the connection here, it has been returned to the pool.
          if (err) {
            debug.log("err : " + err);
            return callback(err);
          }
          else if(rows.length <=0)
          {
            return callback(null,0);
          }
          debug.log("rows : " + JSON.stringify(rows));
          debug.log(rows);
          return callback(null, rows);
      });
    });
  }
  else
  {
    pool.getConnection(function (err, con) {
      // Use the connection
      if (err){
        return callback(err);
      }
      con.query('SELECT academic, classname, professor_user_id, student_user_id FROM classroom left join student_classroom on classroom.academic = student_classroom.classroom_academic where student_user_id = ?', 
        [userId],
        function (err, rows) {
          con.release(); // Don't use the connection here, it has been returned to the pool.
          if (err) {
            debug.log("err : " + err);
            return callback(err);
          }
          else if(rows.length <=0)
          {
            return callback(null,0);
          }
          debug.log("rows : " + JSON.stringify(rows));
          debug.log(rows);
          return callback(null, rows);
      });
    });
  }
}

exports.find_user = function(userId,callback){

  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT ID, password, name, sex, major FROM user where ID = ?', 
      [userId],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));
        rowObj = rows[0];
        debug.log(rowObj);

        return callback(null, rowObj);
    });

  }); 
}

exports.isStudent = function(userId,callback){

  pool.getConnection(function (err, con) {
    // Use the connection
    if (err){
      return callback(err);
    }
    con.query('SELECT grade FROM student where user_id = ?', 
      [userId],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,-1);
        }
        debug.log("rows : " + JSON.stringify(rows));
        rowObj = rows[0];
        debug.log(rowObj);

        return callback(null, rowObj);
    });

  }); 
}
exports.login_user = function(userId, password, callback){
  pool.getConnection(function (err, con) {
    // Use the connection
    con.query('SELECT ID FROM user where ID = ? and password = ?', 
      [userId, password],
      function (err, rows) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        else if(rows.length <=0)
        {
          return callback(null,0);
        }
        debug.log("rows : " + JSON.stringify(rows));
        // debug.log("room start>>>> " + rows);
        //debug.log(rows);
        //rowObjs = JSON.stringify(rows);
        rowObj = rows[0];
        debug.log(rowObj);
        //debug.log("vId: " + rowObj.videoId)
        //debug.log("vTs: " + rowObj.videoTimestamp)

        return callback(null, 1);
    });

  }); 
}
exports.insert_user = function(userName,callback) {
  var userId;

  pool.getConnection(function (err, con) {
    // Use the connection
    con.query('INSERT INTO user(nickname) VALUES (?)', [userName],
      function (err, result) {
        con.release(); // Don't use the connection here, it has been returned to the pool.
        if (err) {
          debug.log("err : " + err);
          return callback(err);
        }
        
        if(result.length <= 0)
        {
          debug.log('already exists');
          return callback(null, -1);
        }
        userId = result.insertId;
        debug.log("uuuu1 :" + userId);
        return callback(null,userId);
    });
  }); 
}

exports.set_time_rewind = function(timeSec, nickname, roomId, callback)
{
  pool.getConnection(function(err,con){
    con.query('SELECT roomId, roomName, videoId, videoTimestamp, bangjangId, nickname FROM room left join user on room.bangjangId = user.userId where user.nickname = ?',[nickname],function(err,result){
      if(err){
        debug.log('err : ' + err);
        return callback(err);
      }
      var videoStarttimeSeconds = Math.floor((new Date().getTime() - Number(timeSec) * 1000) / 1000);
      con.query('UPDATE room SET videoTimestamp = ? WHERE roomId = ?', [videoStarttimeSeconds,roomId], function(err, result){
        con.release();
        if(err)
        {
          debug.log('err : ' + err);
          return callback(err);
        }
        return callback(null, true);
      })
    })
  })
}