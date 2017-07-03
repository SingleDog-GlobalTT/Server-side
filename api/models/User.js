/**
 * Created by Varit on 5/10/17.
 */

module.exports = {

  attributes: {
    user_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    username: {
      type: 'string',
      size: 200
    },
    password:{
      type: 'string',
      size: 200
    },
    year:{
      type:'integer'
    },
    month:{
      type:'integer'
    },
    day:{
      type: 'integer'
    },
    tel:{
      type: 'string',
      size: 200
    },
    gender:{
      type: 'integer'
    },
    postcode:{
      type: 'integer'
    },
    email: {
      type: 'string',
      size: 200
    }
  }

};
