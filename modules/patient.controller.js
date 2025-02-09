const PatientDetails = require("../models/patientDetails.model");
const UserDetails = require("../models/userDetails.model");
const { filterData, assignDoc } = require("../services/common.service");
const {
  findOne,
  create,
  bulkUpdate,
} = require("../services/pg.service");
const { log, error } = require("../services/response.service");
const { roles, patientStatus } = require("../utils/constants.utils");
const consts = require("../utils/constants.utils");
const msg = require("../utils/messages.utils");
const { Op } = require("sequelize");

module.exports = {
  /*
dynamic assign doc: if no one: not doc available: -
                    if one available: assign
                    if two or more then: last treated date comparing with current date : more
*/
  registerPatient: async (req, res) => {
    try {
      const userId = req.user.userId;
      const id = req.params.id;
      const isExist = await findOne({
        model: UserDetails.name,
        query: {
          where: { id: id },
          attributes: ["name"],
        },
        include: {
          model: PatientDetails.name,
          where: { patientId: id },
          attributes: ["id"],
        },
      });
      if (!isExist) return res.json(log(false, msg.user.NOT_REG));
      else if (id == userId) return res.json(log(false, msg.user.PREVENT_OWN));
      else if (isExist[`${PatientDetails.name}`]?.id)
        return res.json(log(false, msg.user.ALREADY_EXIST_PATIENT));
      const createEntry = await create({
        model: PatientDetails.name,
        data: {
          patientName: isExist?.name,
          patientId: id,
          createdBy: userId,
        },
      });
      if (createEntry) return res.json(log(true, msg.user.PATIENT_REG_DONE));
      return res.json(log(false, msg.user.FAILED));
    } catch (err) {
      error(err);
    }
  },
  getList: async (req, res) => {
    const { userId, role } = req.user;
    let conditionalQuery = {};
    if (roles.ADMIN == role) {
      conditionalQuery = {
        where: {},
        attributes: [
          "patientId",
          "patientName",
          "doctorId",
          "doctorName",
          "status",
          "createdBy",
          "updatedBy",
          "created",
          "updated",
          "completedAt",
        ],
      };
    } else if (roles.DOCTOR == role) {
      conditionalQuery = {
        where: { doctorId: userId },
        attributes: [
          "patientId",
          "patientName",
          "status",
          "created",
          "updated",
          "completedAt",
        ],
      };
    } else {
      conditionalQuery = {
        where: { patientId: userId },
        attributes: [
          "patientId",
          "doctorId",
          "doctorName",
          "status",
          "created",
        ],
      };
    }

    const getData = await findOne({
      model: PatientDetails.name,
      query: conditionalQuery,
    });
    if (getData) return res.json(log(true, "Success", filterData(getData)));
    return res.json(log(true, "Success"));
  },
  assignDoc: async (req, res) => {
    try {
      const { userId, role, name } = req.user;
      const { patientId, docId } = req.body;
      let docName = "";
      const isAdmin = role == roles.ADMIN;
      if (isAdmin) {
        if (!docId) return res.json(log(false, msg.auth.DOC_ID_REQ));
        const isExist = await findOne({
          model: UserDetails.name,
          query: {
            where: { id: docId, role: roles.DOCTOR },
            attributes: ["name"],
          },
        });
        if (!isExist) return res.json(log(false, msg.auth.DOC_NOT_FOUND));
        docName = isExist?.name;
      } else if (!isAdmin && docId)
        return res.json(log(false, msg.auth.DOC_ID_NOT_REQ));
      const isExist = await findOne({
        model: PatientDetails.name,
        query: {
          where: { patientId: patientId },
          attributes: ["patientName"],
        },
      });
      if (!isExist) return res.json(log(false, msg.auth.PATIENT_NOT_FOUND));

      const updates = [
        {
          model: UserDetails.name,
          data: {
            isAssigned: consts.assignedDoc.YES,
            adminRemark: assignDoc(patientId, userId),
          },
          where: { id: docId || userId },
        },
        {
          model: PatientDetails.name,
          data: {
            doctorId: docId || userId,
            doctorName: docName || name,
            status: patientStatus.DOC_ASSIGNED,
            updatedBy: userId,
          },
          where: { patientId: patientId },
        },
      ];

      const updatePatientData = await bulkUpdate(updates);
      const respMsg = isAdmin
        ? `Dr.${docName} is assigned for ${isExist?.patientName}`
        : `${isExist?.patientName} is assigned to you`;

      if (updatePatientData) return res.json(log(true, respMsg));
      return res.json(log(false, msg.auth.INTERNAL_ERROR));
    } catch (err) {
      error(err);
    }
  },
};
