/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `UserController.Register()`
   * feature: register the user information to DB
   */
  Register: function (req, res) {

    if(req.method == "POST") {

      var user = req.param('uname');

      console.log(user);

      return res.json({
        status: 'Success',
        username: user
      });
    }
    else{
      return res.json({status: "Error"});
    }
  },


  /**
   * `UserController.Login()`
   */
  Login: function (req, res) {
    return res.json({
      todo: 'Login() is not implemented yet!'
    });
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

