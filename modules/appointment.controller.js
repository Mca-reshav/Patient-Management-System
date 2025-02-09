const AppointmentDetails = require("../models/appointmentDetails.model");
const PatientDetails = require("../models/patientDetails.model");
const UserDetails = require("../models/userDetails.model");
const { filterData, assignDoc, validateDate, bookingResp, checkSlotAvailable} = require("../services/common.service");
const {
  findOne,
  create,
  bulkUpdate,
  update,
  findAll,
} = require("../services/pg.service");
const { log, error } = require("../services/response.service");
const { roles, patientStatus, appointmentStatus, slotList, appointmentStatusMsg } = require("../utils/constants.utils");
const msg = require("../utils/messages.utils");
const { Op } = require("sequelize");
const moment = require('moment');

module.exports = {
  bookAppointment: async (req, res) => {
    const { userId, role, name } = req.user;
    const { docId, date, slotId } = req.body;

    if (role == roles.USER && !docId) return res.json(log(false, msg.auth.DOC_ID_REQ));
    const checkDate = validateDate(date);
    if (!checkDate) return res.json(log(false, msg.user.INVALID_DATE));

    const checkData = await findOne({
      model: UserDetails.name,
      query: {
        where: { id: docId, role: roles.DOCTOR},
        attributes: ["name"]
      }
    });
    if (!checkData) return res.json(log(false, msg.auth.DOC_NOT_FOUND));
    
    const checkAppointment = await findAll({
      model: AppointmentDetails.name,
      query: {
        where: { doctorId: docId },
        attributes: ["appointmentDate","slot"]
      }
    });
    const checkSlot = checkSlotAvailable(date, slotId, checkAppointment);
    if (!checkSlot) return res.json(log(false, msg.user.SLOT_NOT_AVAILABLE));
    const addRecord = await create({
      model: AppointmentDetails.name,
      data: {
        patientId: userId,
        doctorId: docId, 
        appointmentDate: date, 
        slot: slotId, 
        status: appointmentStatus.CREATED, 
        createdBy: userId
      }
    });

    if (!addRecord) return res.json(log(false, msg.error.BOOK_APPOINTMENT));
    
    const respData = bookingResp(name, checkData?.name, slotId);
    return res.json(log(true, msg.user.BOOKED_APPOINTMENT, respData));
  },
  editAppointment: async (req, res) => {
    console.log(req.body);
    return res.json(log(true, 'Success'));
  },
  cancelAppointment: async (req, res) => {
    console.log(req.body);
    return res.json(log(true, 'Success'));
  },

  /*
  user: id, docName, status, appointmentDate, slot, created

doc: id, patientId, patientName, status, appointmentDate, slot, created, updated

admin: id, patientId, patientName, docId, doctorName, status, appointmentDate, slot, created, updated, 

  */
  listAppointment: async (req, res) => {
    const { userId, role } =  req.user;
    if (role == roles.USER) {
      const getData = await findAll({
        model: AppointmentDetails.name,
        query: {
          where: {patientId: userId,
            status: { [Op.ne] : appointmentStatus.CANCELLED }
          },
          attributes: ["doctorId", "id", "status", "appointmentDate", "slot", "created"]
        }
      });

      const docIdAry = [];
      
    };
    return res.json(log(true, 'Success'));
  },
  availableSlot: async (req, res) => {
    console.log(req.query, req.user);
    const { userId, role, name } = req.user;
    const { docId } = req.query;
    // const isDoc = (role != roles.DOCTOR);

    // if (isDoc && !docId) return res.json(log(msg.auth.DOC_ID_REQ));
    // if (isDoc && docId) return res.json(log(msg.auth.DOC_ID_NOT_REQ));

    const getDocData = await findOne({
        model: UserDetails.name,
        query: {
          where: { id: docId, role: roles.DOCTOR},
          attributes: ["name"]
        }
    });
    if (!getDocData) return res.json(log(false, msg.auth.DOC_NOT_FOUND));
    const checkData = await findOne({
      model: AppointmentDetails.name,
      query: {
        where: { doctorId: docId},
        attributes: ["slot"]
      }
    });
    (checkData)
    return res.json(log(true, 'Success', getDocData));
  }
};
