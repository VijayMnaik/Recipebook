const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "This field is required.",
  },
  password: {
    type: String,
    required: "This field is required.",
  },
});

module.exports = mongoose.model("admins", adminSchema);
