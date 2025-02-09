const express = require('express');
const { global, one } = require('../middlewares/main.mw');
const patientController = require('../modules/patient.controller');
const patientValidator = require('../validators/patient.validator');
const { roles } = require('../utils/constants.utils');

const patientRoutes = express.Router();
patientRoutes.use(global);

const routes = [
  {
    method: 'get',
    path: '/list',
    middlewares: [one.webAuth, one.role(roles.USER)],
    handler: patientController.getList
  },
  {
    method: 'post',
    path: '/register/:id',
    middlewares: [one.webAuth, one.role(roles.DOCTOR), one.validate(patientValidator.register)],
    handler: patientController.registerPatient
  },
  {
    method: 'post',
    path: '/assignDoc',
    middlewares: [one.webAuth, one.role(roles.DOCTOR), one.validate(patientValidator.assignDoc)],
    handler: patientController.assignDoc
  },
  // {
  //   method: 'delete',
  //   path: '/remove/:groceryId',
  //   middlewares: [one.webAuth, one.role(roles.ADMIN)],
  //   handler: patientController.removeProduct
  // },
  // {
  //   method: 'put',
  //   path: '/edit/:groceryId',
  //   middlewares: [one.webAuth, one.role(roles.ADMIN), one.validate(patientValidator.update)],
  //   handler: patientController.updateProduct
  // }
];

const methodNotAllowed = (req, res) => {
  res.status(405).json({ error: 'Method Not Allowed' });
};

routes.forEach(({ method, path, middlewares = [], handler }) => {
  try {
    if (!patientRoutes[method]) {
      console.warn(`Invalid method '${method}' for route '${path}'.`);
      return;
    }
    patientRoutes[method](path, ...middlewares, handler);
  } catch (error) {
    console.error(`Failed to set up route ${path}:`, error);
  }
});

patientRoutes.use((req, res) => {
  res.status(404).json({ error: 'Resource Not Found' });
});

patientRoutes.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = patientRoutes;
