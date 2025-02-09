const roles = Object.freeze({
  ADMIN: 1,
  DOCTOR: 2,
  USER: 3,
});

const assignedDoc = Object.freeze({
  YES: "1",
  NO: "0",
});

const permissibleRole = Object.freeze({
  1: [roles.ADMIN],
  2: [roles.ADMIN, roles.DOCTOR],
  3: [roles.ADMIN, roles.DOCTOR, roles.USER],
});

const genderTypes = Object.freeze({
  MALE: "1",
  FEMALE: "2",
  OTHERS: "3",
});

const appointmentStatus = Object.freeze({
  CREATED: "1",
  NEXT_DATE: "2",
  DONE: "3",
  CANCELLED: "4"
});

const appointmentStatusMsg = Object.freeze({
  1: "Appointment created",
  2: "Next data given",
  3: "Treatment given",
  4: "Cancelled"
});

const patientStatus = Object.freeze({
  CREATED: "1",
  DOC_ASSIGNED: "2",
  BOOKED_APPOINTMENT: "3",
  DONE: "4"
});

const patientStatusMsg = Object.freeze({
  1: "Patient record created",
  2: "Doctor assigned",
  3: "Treatment completed",
});

const slotList = Object.freeze({
  1: "10:00 am",
  2: "10:30 am",
  3: "11:00 am",
  4: "11:30 am",
  5: "12:00 pm",
  6: "12:30 pm",
  7: "01:00 pm",
  8: "01:30 pm",
  9: "02:30 pm",
  10: "03:00 pm",
  11: "03:30 pm",
  12: "04:00 pm",
  13: "04:30 pm",
  14: "05:00 pm",
  15: "05:30 pm",
});
module.exports = {
  roles,
  permissibleRole,
  genderTypes,
  assignedDoc,
  appointmentStatus,
  patientStatus,
  patientStatusMsg,
  appointmentStatusMsg,
  slotList
};
