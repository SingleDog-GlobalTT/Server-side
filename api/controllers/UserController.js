/**
 * UserController ching
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async'),
   typeOf = require('typeof'),
  ageCalculator = require('age-calculator');


module.exports = {

  /**
   * `UserController.Register()`
   * feature: register the user information to DB
   */
  Register: function (req, res) {

    if(req.method == "POST") {

      console.log("POSt data has come");

      function findUserId(callback) {
        var last_id_query = {
          select: ['user_id'],
          sort: 'user_id DESC'
        };
        User.find(last_id_query, function (err, last_id) {
          console.log(last_id[0].user_id);
          callback(null, last_id[0].user_id+1); //id of registering user
        });

      }

      function defineValue(user_id, callback) {

        var gender = req.param('gender'),
          username = req.param('username'),
          password = req.param('password'),
          email = req.param('email'),
          year = req.param('year'),
          month = req.param('month'),
          day = req.param('day'),
          tel = req.param('tel'),
          postcode = req.param('postcode'),
          query_create_user = {
            gender: gender,
            username: username,
            password: password,
            email: email,
            year: year,
            month: month,
            day: day,
            tel: tel,
            postcode: postcode
          };

        console.log("data: ",req.param('data'));

          //upload the image
          req.file('avatar').upload({
              dirname: require('path').resolve(sails.config.appPath, 'assets/images'),
              saveAs:user_id+".jpg"
            },
            function (err, avatar_image) {
              console.log(avatar_image);
            });

        callback(null, query_create_user);

      }//end func

      function createRecord(query_create_user, callback) {

        User.create(query_create_user).exec(function (err, record) {
          console.log('created: ', record);
        });

        callback(null, 'done');
      }//enf fnc

      async.waterfall([
        findUserId,
        defineValue,
        createRecord
      ], function (err, result) {

        console.log(err);

        return res.json({
          status: 'Success'
        });

      });

    }//end if
    else{
      return res.json({status: "Error"});
    }
  },


  /**
   * `UserController.Login()`
   */
  Login: function (req, res) {
    if(req.method == "GET") {

      function defineValue(callback) {
        //get post data from view
        var username_view = req.param('username'),
          password_view = req.param('password'),
          login_query = {
            select: ['user_id'],
            where: {
                username: username_view,
                password: password_view
            }
          };

        callback(null, login_query);
      }//end fnc

      function passport(login_query, callback) {
        //login check
        User.find(login_query).exec(function find(err, found) {

          if(err){console.log(err);}
          console.log(found);
          try {
            if (found.length == 0) {//login failed
              return res.json({user_id: 0});
            }
            else if (found.length > 0) {//login succeed

              req.session.user_id = found[0].user_id;
              return res.json({user_id: found[0].user_id});
            }
            else {
              return res.json({user_id: "error"});
            }
          }catch (error){
            console.error(error);
            return res.json({user_id: "error"});
          }

        });//end find
      }//end func

      async.waterfall([
        defineValue,
        passport
      ],function (err, result) {

      });

    }
    else{
      return res.json({status:"error"});
    }
  },


  /**
   * `UserController.Info()`
   */
  Profile: function (req, res) {

    function getAge(d1, d2){
      d2 = d2 || new Date();
      var diff = d2.getTime() - d1.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    if(req.method == "GET"){

      var user_id = req.param('user_id'),
        profile_query = {
          select:['username','email','postcode', 'year', 'month', 'day'],//in future will select user_similarity and image link
          where:{user_id: user_id}
        };

      User.find(profile_query).exec(function (err, records) {

        var user_age = getAge(new Date(records[0].year, records[0].month, records[0].day));

        return res.json({
          username: records[0].username,
          email: records[0].email,
          postcode: records[0].postcode,
          age: user_age

        })
      });

    }
    else {

      return res.json({
        todo: 'Info() is not implemented yet!'
      });
    }
  }
};
