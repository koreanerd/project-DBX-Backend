require("dotenv").config();
require("./src/configs/firebaseAdmin");
const express = require("express");
const logger = require("morgan");
const usersRouter = require("./src/routes/users");
const categoriesRouter = require("./src/routes/categories");
const providedUrl = require("./src/routes/providedUrl");
const connectDatabase = require("./src/configs/database");
const corsMiddleware = require("./src/middlewares/cors");
const app = express();

connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(corsMiddleware);
app.use(logger("dev"));
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/dbx", providedUrl);

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log("err", err);
  res.status(err.status || 500);
  res.json();
});

module.exports = app;
