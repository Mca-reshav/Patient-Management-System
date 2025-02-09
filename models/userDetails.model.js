const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/pg.db");
const { roles, assignedDoc } = require("../utils/constants.utils");

const UserDetails = sequelize.define(
  "UserDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    contact: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: roles.USER
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      field: 'date_of_birth',
      allowNull: false,
    },
    gender: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    isAssigned: {
      type: DataTypes.CHAR(1),
      defaultValue: assignedDoc.NO,
      field: 'is_assigned',
    },
    adminRemark: {
      type: DataTypes.STRING(50),
      field: 'admin_remark',
      allowNull: true,
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "pms_user_details",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);

module.exports = UserDetails;
