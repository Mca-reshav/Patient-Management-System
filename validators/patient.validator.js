const Joi = require('joi');

module.exports = {
    register :Joi.object({
        id: Joi.number().min(1).required(), 
    }),
    assignDoc: Joi.object({
        patientId: Joi.number().min(1).required(),
        docId: Joi.number().min(1).optional()
    })
}
