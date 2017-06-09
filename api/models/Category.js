/**
 * Created by Varit on 6/5/17.
 */
module.exports = {
  attributes:{
    category_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    category_name:{
      type: 'varchar',
      size: 45
    }
  }
};
