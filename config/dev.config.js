const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: process.env.PORT,

  jwtConfig: {
    secretKey: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  pgConfig: {
    protocol: "postgres",
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    logging: false,
    dialect: "postgres",
  },

  webPageDomain: ['*'],
};

module.exports = { config };
