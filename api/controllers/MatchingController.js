/**
 * Created by Varit on 5/29/17.
 */

var async = require('async');
var unique = require('array-unique');
var arraySum = require('array-sum');


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
          category_value = [4,4,4,4];


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
            value: category_value[i]
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
        console.log("answer_list: ", answer_list);

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
          other_value_all = [];

        AnswerLog.find(other_category_query, function (err, other_category_value) {

          var other_category_value_num = other_category_value.length;

          if(err){console.log(err);}

          //make all combine array
          for(var i=0; i<other_category_value_num; i++){
            other_value_all[i] = ({user_id: other_category_value[i].user_id,value: other_category_value[i].value});
          }

          callback(null, current_user_category_value, other_value_all);

        });

      }

      function combineCategory(current_user_category_value, other_user_category_value, callback) {

        console.log("current user: ", current_user_category_value);
        console.log("other user: ", other_user_category_value);

        //combine current user value
        var current_user_length = current_user_category_value.length,
          other_user_length = other_user_category_value.length,
          current_user_combine_value = 0,
          other_user_combine_value = [],
          counter =0,
          index = 0,
          other_value = [],
          current_value = [],
          compare_value = [],
          compare = [];

        //combine other user values
        for(var l=0; l< other_user_length; l++){

          other_value[counter] = other_user_category_value[l].value;
          current_value[counter] = current_user_category_value[counter];
          compare[counter] = Math.abs(current_user_category_value[counter] - other_user_category_value[l].value);
          //console.log("compare[counter]: ", compare[counter]);
          //console.log("counter: ", counter);
          //console.log("l: ", l);
          //console.log("index: ", index);
          counter++;

          if(counter == 4){

            //console.log("counter activate: ", value);
            compare_value.push({user_id:other_user_category_value[index].user_id, value: compare });
            index += 4;
            //console.log("counter: ", counter);
            //console.log("l: ", l);
            //console.log("index: ", index);
            counter = 0;
            compare = [];
          }

        }//end loop

        console.log("compare_value: ", compare_value);

        //combine the array
        var combine_array_value = [],
        sum_array;

        for(var x=0; x<compare_value.length;x++){

          sum_array = arraySum(compare_value[x].value);

          combine_array_value.push({user_id: compare_value[x].user_id, combine_value: sum_array});
        }

        console.log("combine_array_value: ", combine_array_value);

        callback(null ,combine_array_value);

      }//end func

      function compareUser(combine_array_value, callback) {
        //console.log("current: ", current_user_combine_value);
        //console.log("other: ", combine_array_value);

        var compare_value = [];

        for(var i=0; i< combine_array_value.length;i++){

          compare_value[i] =  {
            user_id: combine_array_value[i].user_id,
            similar:((32 - combine_array_value[i].combine_value )/32)*100
          };

          //console.log("calculate debug: ", combine_array_value[i].combine_value - current_user_combine_value);

        }

        //console.log("compare_value: ",compare_value);

        callback(null, compare_value);

      }

      function findUserDetail(compare_value, callback) {

        var user_id = [],
          user_query,
          user_age = [];

        /*
        * feature: convert from birthday to age
        * */
        function getAge(d1, d2){
          d2 = d2 || new Date();
          var diff = d2.getTime() - d1.getTime();
          return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }

        //console.log("compare_value: ", compare_value);

        for(var i=0; i<compare_value.length;i++){
          user_id[i] = compare_value[i].user_id;
        }

        user_query = {
          select:['user_id', 'username', 'year', 'month', 'day', 'postcode'],
          where:{user_id: user_id}
        };

        User.find(user_query, function (err, user_detail) {

          //console.log("user_detail: ", user_detail);

          for(var i=0; i< user_detail.length; i++) {

            user_age.push(getAge(new Date(user_detail[i].year, user_detail[i].month, user_detail[i].day) ) );

            //console.log("user_age: ", user_age);

          }

          callback(null, compare_value, user_detail, user_age);

        });

      }

      async.waterfall([
        findCurrentUserCategoryLog,
        findOtherUserCategoryLog,
        combineCategory,
        compareUser,
        findUserDetail
      ], function (err, compare_value, user_detail, user_age) {

          return res.json({
            compare_value: compare_value,
            user_detail: user_detail,
            user_age: user_age
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
