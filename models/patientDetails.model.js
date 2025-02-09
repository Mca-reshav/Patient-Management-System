const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/pg.db");
const { patientStatus } = require("../utils/constants.utils");

const PatientDetails = sequelize.define(
  "PatientDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'patient_name',
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'doctor_id',
      references: {
        model: 'pms_user_details',  // Reference to pms_user_details
        key: 'id',
      },
    },
    doctorName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'doctor_name'
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'patient_id',
      references: {
        model: 'pms_user_details',  // Reference to pms_user_details
        key: 'id',
      },
    },
    status: {
      type: DataTypes.CHAR(1),
      defaultValue: patientStatus.CREATED,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by',
      references: {
        model: 'pms_user_details',  // Reference to pms_user_details
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'updated_by',
      references: {
        model: 'pms_user_details',  // Reference to pms_user_details
        key: 'id',
      },
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
  },
  {
    tableName: "pms_patient_details",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);

module.exports = PatientDetails;
