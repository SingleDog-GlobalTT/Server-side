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


      /*
       * feature: make a query for the questions's content
       * parameter:
       *   integer -> type of the question
       *              <0:query all the question>
       *                  <1:query question of the user>
       *                      <2:query question of the admin>
       * */
      function queryQuestion(question_type_id,callback) {

        var question_query,
          question_num = req.param('question_num'),
          question_num_default = 14;

        console.log("question_num: ", question_num);

        if(question_num == null){
          question_num = question_num_default;
        }

        if(question_type_id == 0){
          question_query = "SELECT question.question_name, question.user_id, user.username, question.createdAt \n"+
            "FROM `question` \n"+
            "INNER JOIN user \n"+
            "LIMIT = 4";
        }
        else if(question_type_id == 1) {

          console.log("question_type_id: ", question_type_id);

          question_query = "SELECT question.question_name, question.user_id, user.username, question.createdAt, question.question_type_id, category_id  \n"+
            "FROM `question` \n"+
            "INNER JOIN user \n"+
            "ON question.user_id = user.user_id \n"+
            "WHERE question.question_type_id ="+question_type_id+" \n"+
            "LIMIT "+question_num

        }
        else if(question_type_id == 2){

          console.log("question_type_id: ", question_type_id);

          question_query = "SELECT question.question_name, question.user_id, user.username, question.createdAt, question.question_type_id, category_id  \n"+
            "FROM `question` \n"+
            "INNER JOIN user \n"+
            "ON question.user_id = user.user_id \n"+
            "WHERE question.question_type_id ="+question_type_id+" \n"+
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

        var question_type = req.param('question_type');

        if(question_type == 1){//for query the user's question
          callback(null, 1);
        }
        else if(question_type == 2){//for query the admin's question
          callback(null, 2);
        }
        else if(question_type == null || question_type==0){// for query all the question
          callback(null, 0);
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
          question_name: question_name
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
    if(req.method == "POST"){

      var question_id = param('question_id'),
        score = param('score'),
        user_id = param('user_id');

      function defineQuery(callback) {
        var query = {question_id: question_id};
        callback(null, query)
      }

      function recordScore(query, callback) {

        Question.update(query);

      }

      async.waterfall([
        defineQuery,
        recordScore
      ],function (err, result) {
        res.json();
      })
    }
    else{
      res.json({status: "Please use POST request"});
    }

  }
};
