/**
 * Created by Varit on 5/29/17.
 */
var async = require('async');

module.exports = {

  GetQuestion: function (req,res) {

    var error_msg = "Bad Request/ Error";

    if(req.method== "GET"){

      function returnQuestion(question_list) {
        return res.json({
          question_list: question_list
        })
      }

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

  }
};
