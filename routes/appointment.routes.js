const express = require('express');
const { global, one } = require('../middlewares/main.mw');
const appointmentController = require('../modules/appointment.controller');
const appointmentValidator = require('../validators/appointment.validator');
const { roles } = require('../utils/constants.utils');

const appointmentRoutes = express.Router();
appointmentRoutes.use(global);

const routes = [
  {
    method: 'post',
    path: '/book',
    middlewares: [one.webAuth, one.role(roles.USER), one.validate(appointmentValidator.book)],
    handler: appointmentController.bookAppointment
  },
  {
    method: 'put',
    path: '/edit',
    middlewares: [one.webAuth, one.role(roles.USER), one.validate(appointmentValidator.edit)],
    handler: appointmentController.editAppointment
  },
  {
    method: 'get',
    path: '/list',
    middlewares: [one.webAuth, one.role(roles.USER)],
    handler: appointmentController.listAppointment
  },
  {
    method: 'delete',
    path: '/cancel',
    middlewares: [one.webAuth, one.role(roles.USER), one.validate(appointmentValidator.cancel)],
    handler: appointmentController.cancelAppointment
  },
  {
    method: 'post',
    path: '/availableSlot',
    middlewares: [one.webAuth, one.role(roles.USER), one.validate(appointmentValidator.availableSlot)],
    handler: appointmentController.availableSlot
  }
];

const methodNotAllowed = (req, res) => {
  res.status(405).json({ error: 'Method Not Allowed' });
};

routes.forEach(({ method, path, middlewares = [], handler }) => {
  try {
    if (!appointmentRoutes[method]) {
      console.warn(`Invalid method '${method}' for route '${path}'.`);
      return;
    }
    appointmentRoutes[method](path, ...middlewares, handler);
  } catch (error) {
    console.error(`Failed to set up route ${path}:`, error);
  }
});

appointmentRoutes.use((req, res) => {
  res.status(404).json({ error: 'Resource Not Found' });
});

appointmentRoutes.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = appointmentRoutes;
