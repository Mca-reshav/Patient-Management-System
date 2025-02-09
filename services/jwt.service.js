const jwt = require("jsonwebtoken");
const {config} = require("../config/dev.config");

/**
 * Generates a JWT token
 * @param {Object} data - Data to be encoded in the JWT
 * @returns {Promise<Object>} - A promise containing the status and token
 */
const generateJwt = async (data) => {
  return new Promise((resolve) => {
    const jwtData = jwt.sign(data, config.jwtConfig.secretKey, {
      expiresIn: config.jwtConfig.expiresIn,
    });

    resolve({
      status: true,
      token: jwtData,
    });
  });
};

/**
 * Verifies a JWT token
 * @param {string} token - The JWT token to be verified
 * @returns {Promise<Object>} - A promise containing the status and decoded JWT data or an error
 */
const verifyJwt = async (token) => {
  return new Promise((resolve) => {
    try {
      const decoded = jwt.verify(token, config.jwtConfig.secretKey);
      resolve({
        status: true,
        jwtData: decoded,
      });
    } catch (error) {
      resolve({
        status: false,
      });
    }
  });
};

/**
 * Extracts Bearer token from the Authorization header
 * @param {string} authorizationHeader - The Authorization header from the request
 * @returns {string|boolean} - The token or false if not valid
 */
const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return false;
  }
  return authorizationHeader.substring(7);
};

module.exports = {
  generateJwt,
  verifyJwt,
  extractBearerToken,
};
