/**
 * Created by Varit on 5/29/17.
 */

var async = require('async');
var unique = require('array-unique');

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

      function answerRecord(category_value, answer_query,callback) {

        console.log("answer_query: ", answer_query);

        AnswerLog.create(answer_query, function (err, created) {

          if(err){console.log(err);}

          console.log(created);

          //callback(null, category_value);

        });

      }//end func

      /*
      * feature: define query value
      * */
      function defineAnswerLog(category_value, callback) {

        var answer_query = [];

        for(var i=0; i< 4; i++) {

          answer_query.push({
            category_id: i+1,
            user_id: user_id,
            value: category_value[i]/5*100
          });

        }// end loop

        AnswerLog.create(answer_query, function (err, created) {
          console.log(created);
        });

        callback(null, category_value, answer_query);

      }

      async.waterfall([
        answerCalculate,
        defineAnswerLog
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

          //make value array
          for(var i=0; i<other_category_value_num; i++){
            other_value.user_id.push(other_category_value[i].user_id);
            other_value.value.push(other_category_value[i].value);
          }

          callback(null, current_user_category_value, other_value);

        });

      }

      function findMatchUser(current_user_category_value, other_user_category_value, callback) {

        console.log("current user: ", current_user_category_value);
        console.log("other user: ", other_user_category_value);

        var matching_range = 5,
          other_user_length = other_user_category_value.user_id.length,
          match_user = [];


        for(var i=0; i<other_user_length; i++){

          var matching_value = current_user_category_value[i]-other_user_category_value.value[i];

          console.log(matching_value, matching_range);

            if( matching_value <= Math.abs(matching_range)){//match
              match_user.push(other_user_category_value.user_id[i]);
            }

        }

        var unique_match_user = unique(match_user);

        callback(null, unique_match_user);

      }//end func

      async.waterfall([
        findCurrentUserCategoryLog,
        findOtherUserCategoryLog,
        findMatchUser
      ], function (err, match_user) {

          return res.json({
            answer: match_user
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
