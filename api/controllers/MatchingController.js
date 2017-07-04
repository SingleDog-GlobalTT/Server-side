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
        category_id = req.param('category_id'),
        user_id = req.param('user_id'),
        answer_value = answer.answer_value,
        answer_num = answer.answer_value.length;

      console.log("answer_value: ", answer_value, "category_id: " ,category_id, "user_id: ", user_id);

      function answerCalculate(callback) {

        var answer_yes = 1,
          answer_no = -1,
          answer_non = 0,
          category_value = [0,0,0,0];


        function addValue(category_number, answer_value) {

          console.log("added value", category_number, answer_value);

          if(answer_value == answer_yes) {
            category_value[category_number]++;
          }
          else if(answer_value == answer_no){
            category_value[category_number]--;
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

        callback(null, category_value);

      }//end func

      function answerRecord(category_value, callback) {

        for(var i=0; i< 4; i++) {

          console.log("category_value", category_value);

          var answer_query = {
            category_id: i+1,
            user_id: user_id,
            value: category_value[i]/5*100
          };

          AnswerLog.create(answer_query).exec(function (err, created) {
            console.log(created);
          });
        }

        callback(null, category_value);

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

  /*
  * feature:
  * */
  MatchingCalculation: function (req,res) {

    if(req.method == "GET") {

      var user_id = req.param('user_id'),
        category_value = req.param('category_value');

      function findMatchUser(callback) {

        var query = {select:['category_id', 'user_id']};

        AnswerLog.find(query, function (err, answer_log) {

          if(!user_id){//should not be a same user id
            console.log("answer_log", answer_log);
          }

          callback(null, "done");
        })

      }

      async.waterfall([
        findMatchUser
      ], function (err, result) {

          return res.json({
            status: result
          });

      });

    }
    else {
      return res.json({
        status: "fail , should use GET method"
      });
    }
  }
};
