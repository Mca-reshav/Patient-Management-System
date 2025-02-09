const Joi = require("joi");
const { log } = require("../services/response.service");

/**
 * Middleware to validate request body, params, or query using Joi schema.
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @returns {RequestHandler} - Express middleware function
 */
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const { error, value } = schema.validate(
        { ...req.body, ...req.params, ...req.query },
        { abortEarly: false, stripUnknown: true }
      );

      if (error) {
        // Collect validation error messages
        const messages = error.details.map(detail => detail.message.replace(/\"/g, ""));
        res.status(400).json(log(false, messages.join(", ")));
        return;
      }

      // Attach validated data to the request object
      req.validatedData = value;
      next();
    } catch (err) {
      res.status(500).json(log(false, "Internal server error"));
    }
  };
};

module.exports = validateRequest;
