const encryptService = require("../services/encrypt.service");
const msg = require("../utils/messages.utils");
const { error, log, success, tokenLog } = require("../services/response.service");
const jwtService = require("../services/jwt.service");
const databaseService = require("../services/pg.service");
const { Op } = require("sequelize");
const commonFn = require("../services/common.service");
const UserDetails = require("../models/userDetails.model");

const userController = {
  async register(req, res) {
    try {
      const { contact, email, password, dateOfBirth} = req.body;
      const checkDate = commonFn.validateDate(dateOfBirth);
      if(!checkDate) return res.json(log(false, msg.user.INVALID_DATE));
      
      const isExist = await databaseService.findOne({
        model: UserDetails.name,
        query: {
          where: {
            [Op.or]: [{ contact }, { email }],
          },
          attributes: ["id"],
        },
      });

      if (isExist) return res.status(400).json(log(false, msg.user.ALREADY_EXIST));

      const encPwd = await encryptService.hashPassword(password);
      delete req.body.password
      const userEntry = await databaseService.create({
        model: UserDetails.name,
        data: {...req.body,  password: encPwd},
      });

      if (!userEntry) return res.status(500).json(log(false, msg.user.FAILED));

      return res.status(201).json(log(true, msg.user.REGISTER_DONE));
    } catch (err) {
      error(err);
      res.status(500).json(log(false, msg.auth.INTERNAL_ERROR));
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const getData = await databaseService.findOne({
        model: UserDetails.name,
        query: {
          where: { email: email },
          attributes: ["id", "name", "password", "role"],
        },
      });
      const userId = getData?.id;
      if (!userId) {
        res.json(log(false, msg.user.NOT_REG));
        return;
      }

      const checkPwd = await encryptService.comparePassword(
        password,
        getData.password
      );
      if (!checkPwd) {
        res.json(log(false, msg.user.WRONG_PASSWORD));
        return;
      }

      const getToken = await jwtService.generateJwt({ userId, role: getData?.role, name: getData?.name });
      tokenLog(getToken.token);
      success(true, msg.user.LOGGED_IN);
      res.json(log(true, msg.user.LOGGED_IN, { authToken: getToken.token }));
    } catch (err) {
      error(err);
    }
  },

  async updateRole(req, res) {
    try {
      const {id, role} = req.body;
      const userId = req.user.userId;

      const isExist = await databaseService.findOne({
        model: UserDetails.name,
        query: { 
          where: { id: id},
          attributes: ["role"]
        }
      });
      if (!isExist) return res.json(log(false, msg.user.USER_NOT_FOUND))
      else if (isExist?.role == role) return res.json(log(true, msg.user.ROLE_UPDATED))
      else if (id == userId) return res.json(log(true, msg.user.PREVENT_OWN))
      else {
        const updateRole = await databaseService.update({
          model: UserDetails.name,
          data: { 
            role: role,
            adminRemark: commonFn.updateRole(isExist.role, role, userId)
          },
          where: { id: id}
        });
        if (updateRole) {
          success(true, msg.user.ROLE_UPDATED);
          return res.json(log(true, msg.user.ROLE_UPDATED));
        }
        return res.json(log(false, msg.user.FAILED))
      }
    } catch (err) {
      error(err)
    }
  }
};

module.exports = userController;
