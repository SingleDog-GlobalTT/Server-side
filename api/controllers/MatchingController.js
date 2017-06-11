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

    function returnResult(answer_list) {
      return res.json({
        answer_list: answer_list
      })
    }

    if(req.method == "POST"){

      var answer = req.param('answer_value'),
        answer_num = answer.answer_value.length,
        category_value;

      function answerCalculate() {

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

        return category_id;

      }

      category_value = answerCalculate();
      console.log("category_value: ", category_value);
      returnResult(category_value);
    }
    else{
      returnResult(error_msg);
    }

  },

  MatchingResult: function (req,res) {

  }
};
