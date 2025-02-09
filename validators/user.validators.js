const Joi = require('joi');
const { genderTypes, roles } = require('../utils/constants.utils');

module.exports = {
  register: Joi.object({
    name: Joi.string().min(3).max(25).required(),
    email: Joi.string().email().required(),
    contact: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
      'string.pattern.base': 'Contact must be a valid 10-digit phone number starting with 6-9.',
    }),
    dateOfBirth: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD format').required().messages({
      'string.pattern.base': 'dateOfBirth must be in YYYY-MM-DD format.',
    }),
    gender: Joi.string().valid(...Object.values(genderTypes)).required(),
    address: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(3).max(20).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(20).required(),
  }),
  updateRole: Joi.object({
    id: Joi.number().required(),
    role: Joi.number().valid(...Object.values(roles)).required()
  })
};
