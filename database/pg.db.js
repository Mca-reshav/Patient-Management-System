const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const { config } = require("../config/dev.config");
const { genLog} = require('../services/response.service');

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: config.pgConfig.host,
  username: config.pgConfig.user,
  password: config.pgConfig.password,
  database: config.pgConfig.database,
  port: config.pgConfig.port,
  logging: config.pgConfig.logging,
  timezone: '+05:30'
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    genLog(true, `POSTGRESQL DATABASE :: PORT: ${config.pgConfig.port}`);
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

testConnection();

module.exports = sequelize;
