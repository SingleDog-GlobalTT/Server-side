/**
 * Created by Varit on 5/29/17.
 */
module.exports = {

  attributes: {
    question_id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    category_id:{
      type: 'integer'
    },
    question_type_id:{
      type: 'integer'
    },
    user_id:{
      type: 'integer'
    },
    question_name: {
      type: 'string',
      size: 200
    },
    question_score: {
      type: 'int',
      size: 200
    }
  }
};
