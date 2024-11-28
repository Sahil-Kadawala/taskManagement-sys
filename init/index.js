const mongoose = require("mongoose");
const Task = require("../models/task");
const data = require("./data");

const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/taskManager");
};

const init = async () => {
  await Task.deleteMany({});
  await Task.insertMany(data.data);
  mongoose.connection.close();
};

main().catch((err) => {
  console.dir(err);
});

init().catch((err) => {
  console.dir(err);
});
