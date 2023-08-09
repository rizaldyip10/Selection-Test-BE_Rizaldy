'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class offDay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  offDay.init({
    offStart: DataTypes.DATE,
    offEnd: DataTypes.DATE,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'offDay',
  });
  return offDay;
};