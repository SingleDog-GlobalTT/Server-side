/**
 * Created by Varit on 6/5/17.
 */
module.exports = {
  attributes:{
    answer_log_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    category_id:{
      type: 'integer'
    },
    user_id:{
      type: 'integer'
    },
    value: {
      type: 'integer',
      size: 100
    }

  }
};
