'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.User)
    }
  }
  Attendance.init({
    clockIn: {
      type: DataTypes.DATE,
    },
    clockOut: {
      type: DataTypes.DATE,
    },
    clockInOT: DataTypes.DATE,
    clockOutOT: DataTypes.DATE,
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Attendance',
    timestamps: false
  });
  return Attendance;
};