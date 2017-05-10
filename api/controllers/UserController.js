/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');

module.exports = {

  /**
   * `UserController.Register()`
   * feature: register the user information to DB
   */
  Register: function (req, res) {

    if(req.method == "POST") {

      /* this will use in real system

       var gender = req.param('gender'),
       user = req.param('username'),
       pass = req.param('password'),
       email = req.param('email'),
       age = req.param('age'),
       postcode = req.param('postcode'),
       user_image = req.file('image').upload(function (err, upload_file) {

       });
       */

      return res.json({
        status: 'Success',
        username: user,
        password: pass
      });
    }
    else{
      /*-----------THIS IS FOR TEST/DEBUG-----------------*/
      function defineValue(callback) {

        var gender = 1,
          user = "endopasmic",
          pass = "00236263",
          email = "varit.asawavetvutt@gmail.com",
          age = 1,
          postcode = 5250066,
          query_create_user = {
            gender: gender,
            username: user,
            password: pass,
            email: email,
            age: age,
            postcode: postcode
          };

        callback(null, query_create_user);

      }//end func

      function createRecord(query_create_user, callback) {

        console.log("create data: ", query_create_user);

        User.create(query_create_user).exec(function (err, record) {
          console.log('created: ', record);
        });

        callback(null, 'done');
      }//enf fnc

      async.waterfall([
        defineValue,
        createRecord
      ], function (err, result) {

      });

      /*-----------THIS IS FOR TEST/DEBUG-----------------*/

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
              or: [
                {username: username_view},
                {password: password_view}
              ]
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
              return res.json({user_id: "not found"});
            }
            else if (found.length > 0) {//login succeed
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
  Info: function (req, res) {
    return res.json({
      todo: 'Info() is not implemented yet!'
    });
  }
};

