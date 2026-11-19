import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test", // link to Test
      required: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    answers: {
  type: [String], // one entry per question, e.g. ["A", "C", null, "B"]
  default: [],
},

    // ---------- Timed exam + anti-cheat data ----------
    timeTakenSeconds: { type: Number, default: null }, // how long the student took
    tabSwitchCount: { type: Number, default: 0 },      // how many times they left the tab
    tabSwitchLog: { type: [Date], default: [] },       // time of each tab switch
    submissionReason: {
      type: String,
      enum: ["manual", "time_up", "tab_switch_limit"], // how the test ended
      default: "manual",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);