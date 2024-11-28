const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed"],
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
