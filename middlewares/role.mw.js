const msg = require("../utils/messages.utils");
const { log } = require("../services/response.service");
const databaseService = require("../services/pg.service");
const common = require("../services/common.service");
const { permissibleRole } = require('../utils/constants.utils');

module.exports = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      const checkRole = await databaseService.findOne({
        model: "UserDetails",
        query: {
          where: { id: user.id || user.userId },
          attributes: ["role"], 
        },
      });
      if (!checkRole || !checkRole.role) {
        return res.status(400).json(log(false, msg.auth.ROLE_NOT_FOUND));
      }
      
      if (permissibleRole[requiredRole].includes(checkRole.role)) {
        return next(); 
      }

      res.status(403).json(log(false, msg.auth.UNAUTH));
    } catch (error) {
      next(error);  
    }
  }
};
