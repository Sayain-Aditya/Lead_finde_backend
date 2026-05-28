const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema({
  type:    { type: String, enum: ["call", "whatsapp", "email", "note"], default: "note" },
  message: { type: String, default: "" },
  date:    { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    category:    { type: String, default: "" },
    city:        { type: String, default: "" },
    address:     { type: String, default: "" },
    phone:       { type: String, default: "" },
    website:     { type: String, default: "" },
    rating:      { type: Number, default: 0 },
    hasWebsite:  { type: Boolean, default: false },
    status:      { type: String, enum: ["New", "Contacted", "Interested", "Closed", "Not Interested"], default: "New" },
    notes:       { type: String, default: "" },
    service:     { type: String, default: "" },
    pitch:       { type: String, default: "" },
    priority:    { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    dealValue:   { type: Number, default: 0 },
    leadScore:   { type: Number, default: 0 },
    followUpDate:{ type: Date, default: null },
    callLog:     { type: [callLogSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
