require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
// const __dirname = path.resolve();
// eslint-disable-next-line no-undef
const url = process.env.DB_URL;

const login = require("./routes/login");

const app = express();

// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(url);

app.use("/", login);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json();
});

module.exports = app;
