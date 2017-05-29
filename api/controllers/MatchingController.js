/**
 * Created by Varit on 5/29/17.
 */

var async = require('async');

module.exports = {

  AnswerRecord: function (req,res) {

    var error_msg = "Bad Request/ Error";

    function returnAnswer(answer_list) {
      return res.json({
        answer_list: answer_list
      })
    }



    if(req.method == "POST"){

      async.waterfall([

      ],function () {

      });
    }
    else{
      returnAnswer(error_msg);
    }

  },

  MatchingResult: function (req,res) {

  }
};
