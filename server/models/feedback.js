const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: "This field is required.",
    // uniqueCaseInsensitive: true,
  },
  recipename: {
    type: String,
    required: "This field is required.",
  },
  rating: {
    type: String,
    required: "This field is required.",
  },
  suggestion: {
    type: String,
    required: "This field is required.",
  },
});

module.exports = mongoose.model("feedback", feedbackSchema);
