const colors = require("colors");

// Enable color formatting for logs
colors.enable();

/**
 * Logs token information with success formatting
 */
const tokenLog = (token) => {
  console.log(`:: SUCCESS :: :: ${token}`.bgBlack);
};

/**
 * Logs success or error messages and invokes the log method
 */
const success = (success = true, msg = "", data = {}) => {
  if (success) {
    console.log(`[SUCCESS] :: ${msg}`.green);
  } else {
    console.log(`[ERROR] :: ${msg}`.red);
  }
  log(success, msg, data);
};

/**
 * Logs error messages with bright red formatting
 */
const error = (e) => {
  console.log(`[CATCH ERROR] :: ${String(e)}`.bgRed);
  return false;
};

/**
 * Logging function for success and error cases
 */
const log = (success = true, message = "", data = {}) => {
  if (!success) {
    console.log(`[ERROR] :: ${message}`.red);
  }
  return { success, message, data };
};

/**
 * General logging function for success cases
 */
const genLog = (success = true, message = "") => {
  if (success) console.log(`[SUCCESS] :: ${message}`.blue);
};

module.exports = {
  tokenLog,
  success,
  error,
  log,
  genLog
};
