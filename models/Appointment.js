const { Schema, model } = require("mongoose");

const schema = new Schema({
  avatar: String,
  timeFrom: String,
  timeTo: String,
  date: String,
  name: String,
  description: String,
  status: String,
});

const AppointmentModel = model("Appointment", schema);

module.exports = AppointmentModel;
