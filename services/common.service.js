const moment = require("moment");
const { patientStatusMsg, slotList } = require("../utils/constants.utils");
const msg = require('../utils/messages.utils');

const dateTimeAry = ["created", "updated", "completed"];
const common = {
  getUserData(req) {
    return { ...JSON.parse(JSON.stringify(req.user)) };
  },
  updateRole(from, to, by) {
    const current = moment().format("YYYY-MM-DD HH:mm:ss");
    return `ROLE UPDATED: ${from} -> ${to} : ${by} :: ${current}`;
  },
  assignDoc(to, by) {
    const current = moment().format("YYYY-MM-DD HH:mm:ss");
    return `DOC ASSIGNED: ${to} : ${by} :: ${current}`;
  },
  bookAppointment(user, on, at, docName) {
    // return `Appointment booked for ${for}`;
  },
  bookingResp(userName, docName, slotId) {
    const validatedSlot = slotList[slotId];
    const current = moment().format('YYYY-MM-DD HH:mm:ss');
    const respObj = {
      "Booked At": current,
      "Booked For": userName || '',
      "Booked With": "Dr." + docName || '',
      "Booked Slot": validatedSlot,
      "Notes": msg.specific.APPOINTMENT_PRIOR,
    };
    return respObj;
  },
  validateDate(givenDate) {
    const diff = moment().diff(moment(givenDate), "days");
    if (diff <= 0 && diff > -2) return true;
    return false;
  },
  checkSlotAvailable(apDate, apSlot, appointmentData) {
    let check = true;
    for (let i=0; i<appointmentData.length; i++) {
      let { appointmentDate, slot } = appointmentData[i];
      let alDate = moment(appointmentDate).format('YYYY-MM-DD');
      if (apDate == alDate) check = !(apSlot == slot);
      if (!check) break;
    }
    return check;
  },
  filterData(obj) {
    let respObj = {};
    if (obj) {
      respObj = Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value != null)
      );

      dateTimeAry.forEach((key) => {
        if (respObj[key]) {
          respObj[key] = moment(respObj[key]).format("YYYY-MM-DD HH:mm:ss");
        }
      });
      if (respObj?.status) respObj.status = patientStatusMsg[respObj.status];
    }
    return respObj;
  },
};
module.exports = common;
