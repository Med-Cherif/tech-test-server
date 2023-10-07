const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
    // get()
  },
});

const UserModel = model("User", schema);

module.exports = UserModel;
