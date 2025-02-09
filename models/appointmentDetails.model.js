const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/pg.db");
const { appointmentStatus } = require("../utils/constants.utils");

const AppointmentDetails = sequelize.define(
  "AppointmentDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'doctor_id',
      references: {
        model: 'pms_user_details',  // Reference to pms_user_details
        key: 'id',
      },
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'appointment_date',
    },
    slot: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: appointmentStatus.CREATED
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'next_date',
    },
    prescribedMedicines: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'prescribed_medicines',
    },
    testsRecommended: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'tests_recommended',
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
  },
  {
    tableName: "pms_appointment_details",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated",
  }
);

module.exports = AppointmentDetails;
