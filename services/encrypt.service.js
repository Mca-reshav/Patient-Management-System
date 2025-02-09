const bcrypt = require("bcrypt");
const { error } = require("./response.service");

const encryptService = {
  /**
   * Hashes a plain text password.
   * @param {string} password - The plain text password.
   * @returns {Promise<string|void>} A promise that resolves to the hashed password.
   */
  async hashPassword(password) {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (err) {
      error(`Error hashing password: ${err.message}`);
    }
  },

  /**
   * Compares a plain text password with a hashed password.
   * @param {string} plainPassword - The plain text password.
   * @param {string} hashedPassword - The hashed password.
   * @returns {Promise<boolean|void>} A promise that resolves to true if passwords match, false otherwise.
   */
  async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      error(`Error comparing password: ${err.message}`);
    }
  },
};

module.exports = encryptService;
