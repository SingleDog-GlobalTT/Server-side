/**
 * Created by Varit on 5/29/17.
 */
var async = require('async'),
  error_msg = "Bad Request/ Error";

function returnQuestion(question_list) {
  return res.json({
    question_list: question_list
  })
}

module.exports = {

  GetQuestion: function (req,res) {

    if(req.method== "GET"){

      /*
      * feature: make a query for the questions's content
      * parameter:
      *   integer -> type of the question
      *              <0:query all the question>
      *                  <1:query question of the user>
      *                      <2:query question of the admin>
      * */
      function queryQuestion(question_type_id,callback) {

        var question_query;

        if(question_type_id == 0){
          question_query = {
            select: ['question_name']
          };
        }
        else {
          question_query = {
            select: ['question_name'],
            where: {question_type:question_type_id}
          };
        }

        Question.find(question_query).exec(function (err, question_name) {
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
        else if(question_type == null){// for query all the question
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

      var question_name = param('question_name'),
        category_id = param('category_id'),
        user_id = param('user_id'),
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
        console.log(result);
        res.json({
          status:"Success"
        });
        
      });

    }
    else{
      returnQuestion(error_msg);
    }

  }
};
