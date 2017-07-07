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

          console.log("answer_query: ", answer_query);


          AnswerLog.create(answer_query).exec(function (err, created) {
            console.log(created);
            callback(null, category_value);
          });

        }
      }//end func

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
  * feature: find the matching value tha]
  * note: gen have to be a opposite
  * */
  MatchingCalculation: function (req,res) {

    if(req.method == "GET") {

      var user_id = req.param('user_id');

      /*
      * feature: find least answer value for current user.
      * */
      function findCurrentUserCategoryLog(callback) {

        var category_query= {
          select:['answer_log_id', 'category_id', 'value'],
          sort:'answer_log_id DESC',
          limit: 4,
          where: {user_id: user_id}
        };

        AnswerLog.find(category_query, function (err, category_value) {

          var category_value_num = category_value.length,
            value = [];


          if(err){
            console.log(err);
          }

          //make value array
          for(var i=0; i<category_value_num; i++){
            value.push(category_value[i].value);
          }

          callback(null, value);

        });
      }//end func

      function findOtherUserCategoryLog(current_user_category_value, callback) {

        var other_category_query = {
          select:['answer_log_id', 'category_id', 'user_id', 'value'],
          where: { user_id:{'!':user_id} }
        },
          other_value = {user_id : [], value:[]};

        AnswerLog.find(other_category_query, function (err, other_category_value) {

          var other_category_value_num = other_category_value.length;

          if(err){console.log(err);}

          console.log("other_category_value", other_category_value);

          //make value array
          for(var i=0; i<other_category_value_num; i++){
            other_value.user_id.push(other_category_value[i].user_id);
            other_value.value.push(other_category_value[i].value);
          }

          callback(current_user_category_value);


        });

      }

      function findMatchUser(current_user_category_value, other_user_category_value, callback) {

      }//end func

      async.waterfall([
        findCurrentUserCategoryLog,
        findOtherUserCategoryLog,
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
