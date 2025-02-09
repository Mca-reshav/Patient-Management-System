const Joi = require('joi');

module.exports = {
    availableSlot: Joi.object({
        docId: Joi.number().allow('').optional()
    }),
    book: Joi.object({
        patientId: Joi.number().optional(),
        docId: Joi.number().optional(),
        date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD format').required().messages({
            'string.pattern.base': 'date must be in YYYY-MM-DD format',
        }),
        slotId: Joi.number().min(1).max(15).required()
    }),
    edit: Joi.object({
        patientId: Joi.number().required()
    }),
    cancel: Joi.object({
        appointmentId: Joi.number().required(),
        reason: Joi.string().min(3).max(200).required()
    })
}