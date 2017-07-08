/**
 * Created by Varit on 5/29/17.
 */
var async = require('async'),
  error_msg = "Bad Request/ Error";

function returnQuestion(res,question_list) {
  return res.json({
    question_list: question_list
  })
}

module.exports = {

  GetQuestion: function (req,res) {

    if(req.method == "GET"){

      var sort_by = req.param('sort_by');

      /*
       * feature: make a query for the questions's content
       * parameter:
       *   integer -> type of the question
       *              <0:query all the question>
       *                  <1:query question of the user>
       *                      <2:query question of the admin>
       * */
      function queryQuestion(question_type_id, sort_query,callback) {

        var question_query,
          question_num = req.param('question_num'),
          question_num_default = 14;

        console.log("question_num: ", question_num);

        if(question_num == null){
          question_num = question_num_default;
        }

        if(question_type_id == 0){
          question_query = "SELECT question.question_id, question.question_name, question.user_id, user.username, question.createdAt \n"+
            "FROM `question` \n"+
            "INNER JOIN user \n"+
            "LIMIT = 4";
        }
        else if(question_type_id == 1) {

          console.log("sort_by: ", sort_query);

          question_query = "SELECT question.question_id, question.question_name, question.user_id, user.username, question.createdAt, question.question_type_id, category_id, question_score  \n"+
            "FROM `question` \n"+
            "INNER JOIN user \n"+
            "ON question.user_id = user.user_id \n"+
            "WHERE question.question_type_id ="+question_type_id+" \n"+
            sort_query+"\n"+
            "LIMIT "+question_num;

        }
        else if(question_type_id == 2){

          console.log("question_type_id: ", question_type_id);

          question_query = "SELECT question.question_id, question.question_name, question.user_id, user.username, question.createdAt, question.question_type_id, category_id, question_score  \n"+
            "FROM `question` \n"+
            "INNER JOIN user \n"+
            "ON question.user_id = user.user_id \n"+
            "WHERE question.question_type_id ="+question_type_id+" \n"+
            sort_query+"\n"+
            "LIMIT "+question_num
        }

        Question.query(question_query,function (err, question_name) {
            callback(null, question_name);
        });

      }

      /*
       * feature: query the list of the question from the DB.
       * */
      function findQuestionType(callback) {

        var question_type = req.param('question_type'),
          sort_query = "";

        //find sort condition
        if(sort_by == 0 || sort_by == null || sort_by == "undefined"){
          sort_query = "ORDER BY question.question_id DESC";
        }
        else if(sort_by == 1){
          sort_query = "ORDER BY question.question_score DESC";
        }
        else if(sort_by == 2){
          sort_query = "ORDER BY question.question_id DESC";
        }

        //find question type condition
        if(question_type == 1){//for query the user's question
          callback(null, 1, sort_query);
        }
        else if(question_type == 2){//for query the admin's question
          callback(null, 2, sort_query);
        }
        else if(question_type == null || question_type==0){// for query all the question
          callback(null, 0, sort_query);
        }
        else{//for error case
          returnQuestion(error_msg);
        }

      }

      async.waterfall([
        findQuestionType,
        queryQuestion
      ], function (err, question_list) {

        if(err){console.error(err);}

        return res.json({
          question_list: question_list
        })

      });
    }
    else{
      returnQuestion(error_msg);
    }

  },//end action

  MakeNewQuestion: function (req,res) {

    if(req.method == "POST"){

      var question_name = req.param('question_name'),
        category_id = req.param('category_id'),
        user_id = req.param('user_id'),
        user_question_id = 1;

      function questionRecord(callback) {
        var question_query = {
          category_id: category_id,
          question_type_id:user_question_id,
          question_name: question_name,
          question_score:0
        };

        Question.create(question_query).exec(function (err, insert_result) {
          callback(null, insert_result);
        })
      }

      async.waterfall([
        questionRecord
      ],function (err, result) {

        if(err){console.error(err);}
        console.log("Record new question into the DB \n", result);
        res.json({
          status:"Success"
        });

      });

    }
    else{
      returnQuestion(res,error_msg);
    }

  },

  AddScore: function (req,res) {

    if(req.method == "POST") {

      var question_id = req.param('question_id'),
        score = req.param('score'),
        user_id = req.param('user_id');

      console.log("GET data: ", question_id, score, user_id);

      function takeCurrentScore(callback) {

        var question_query = {
          select: ['question_score'],
          where: {question_id: question_id}
        };

        //find current score of the question_id
        Question.find(question_query, function (err, score_record) {

          //console.log("score_record: ", score_record[0].question_score);
          callback(null, score_record[0].question_score);
        })
      }

      function defineQuery(score_record, callback) {

        var update_score = parseInt(score_record) + parseInt(score),
          query_find = {question_id: question_id},
          query_update = {question_score: update_score};

        //console.log(query_find, query_update);

        callback(null, query_find, query_update);

      }

      function recordScore(query_find, query_update, callback) {

        Question.update(query_find, query_update).exec(function (err,score) {

          if(err)
          {
            console.log(err)
          }

          console.log(score);

          callback(null, score);
        });



      }//end func

      async.waterfall([
        takeCurrentScore,
        defineQuery,
        recordScore
      ], function (err, score) {
        res.json({status: score});
      })

    }
    else{
      res.json({status: "Please use POST request"});
    }

  }
};
