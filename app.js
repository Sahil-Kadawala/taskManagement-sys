const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Task = require("./models/task.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

main()
  .then((res) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/taskManager");
  } catch (err) {
    console.log("error in main() function");
    throw err;
  }
}

// Index Route
app.get(
  "/api/tasks",
  wrapAsync(async (req, res) => {
    const alltasks = await Task.find();
    res.render("./task/index.ejs", { alltasks });
  })
);

// New route
app.get("/api/tasks/new", (req, res) => {
  res.render("./task/new.ejs");
});

// Create route
app.post(
  "/api/tasks",
  wrapAsync(async (req, res) => {
    let newTask = new Task(req.body.task);
    await newTask.save();
    res.redirect("/api/tasks");
  })
);

// Show Route
app.get(
  "/api/tasks/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const task = await Task.findById(`${id}`);
    res.render("task/show.ejs", { task });
  })
);

//Edit route
app.get(
  "/api/tasks/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const task = await Task.findById(`${id}`);
    res.render("./task/edit.ejs", { task });
  })
);

//Update route
app.put(
  "/api/tasks/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndUpdate(`${id}`, { ...req.body.task });
    res.redirect(`/api/tasks/${id}`);
  })
);

// Delete route
app.delete(
  "/api/tasks/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deletedTask = await Task.findByIdAndDelete(`${id}`);
    console.log(deletedTask);
    res.redirect("/api/tasks");
  })
);

// Toggle Status route
app.patch(
  "/api/tasks/:id/toggle-status",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    task.status = task.status === "completed" ? "pending" : "completed";
    await task.save();
    res.redirect(`/api/tasks/${id}`);
  })
);

app.all("*", (req, res, next) => {
  return next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(3000, () => console.log("server working"));
