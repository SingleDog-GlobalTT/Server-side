/**
 * Created by Varit on 5/29/17.
 */

var async = require('async');

module.exports = {

  /*
  * feature: record and calculate the answer.
  * */
  AnswerRecord: function (req,res) {

    var error_msg = "Bad Request/ Error";

    if(req.method == "POST"){

      var answer = req.param('answer_value'),
        answer_num = answer.answer_value.length;

      function answerCalculate(callback) {

        var answer_yes = 1,
          answer_no = -1,
          answer_non = 0,
          category_id = [0,0,0,0];


        function addValue(category_number, answer_value) {

          console.log("added value", category_number, answer_value);

          if(answer_value == answer_yes) {
            category_id[category_number]++;
          }
          else if(answer_value == answer_no){
            category_id[category_number]--;
          }
        }

        for(var i=0; i<answer_num; i++){

         if(answer.category_id[i] == 1){
           addValue(0, answer.answer_value[i]);
         }
         else if(answer.category_id[i] == 2){
           addValue(1, answer.answer_value[i]);
         }
         else if(answer.category_id[i] == 3){
           addValue(2, answer.answer_value[i]);
         }
         else if(answer.category_id[i] == 4){
           addValue(3, answer.answer_value[i]);
         }

        }// end loop

        callback(null, category_id);

      }

      function answerRecord(category_id) {

        for(var i=0; i< category_id.length; i++)
        answer_query = {
          question_id: 1,
          category_id: i+1
        };
      }

      async.waterfall([
        answerCalculate,
        answerRecord
      ], function (err,answer_list) {
        return res.json({
          answer_list: answer_list
        })
      });
    }
    else{
      returnResult(error_msg);
    }

  },

  MatchingResult: function (req,res) {

  }
};
