const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: "This field is required.",
  },
});

module.exports = mongoose.model("messages", messageSchema);
