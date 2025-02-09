const express = require('express');
const { global, one } = require('../middlewares/main.mw');
const userController = require('../modules/user.controller');
const userValidator = require('../validators/user.validators');
const { roles } = require('../utils/constants.utils');

const userRoutes = express.Router();
userRoutes.use(global);

const routes = [
  {
    method: 'post',
    path: '/register',
    middlewares: [one.validate(userValidator.register)],
    handler: userController.register
  },
  {
    method: 'post',
    path: '/login',
    middlewares: [one.validate(userValidator.login)],
    handler: userController.login
  },
  {
    method: 'put',
    path: '/updateRole',
    middlewares: [one.webAuth, one.role(roles.ADMIN), one.validate(userValidator.updateRole)],
    handler: userController.updateRole
  },
];

routes.forEach(({ method, path, middlewares = [], handler }) => {
  try {
    if (!userRoutes[method]) {
      console.warn(`Invalid method '${method}' for route '${path}'.`);
      return;
    }
    userRoutes[method](path, ...middlewares, handler);
  } catch (error) {
    console.error(`Failed to set up route ${path}:`, error);
  }
});

userRoutes.use((req, res) => {
  res.status(404).json({ error: 'Resource Not Found' });
});

userRoutes.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = userRoutes;
