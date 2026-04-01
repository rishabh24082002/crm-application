const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    company: String,
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "won"],
      default: "new"
    },
    source: String,
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);