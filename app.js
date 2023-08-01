/* eslint-disable no-undef */
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const url = process.env.DB_URL;
const allowedOriginUrl = process.env.ALLOWED_ORIGIN;

const login = require("./routes/login");
const initialSetting = require("./routes/initialSetting");
const categories = require("./routes/categories");
const providedUrl = require("./routes/providedUrl");

const app = express();

const corsOptions = {
  origin: [`${allowedOriginUrl}`],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

mongoose.connect(url);

app.use("/initialSetting", initialSetting);
app.use("/login", login);
app.use("/categories", categories);
app.use("/dbx", providedUrl);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log("err", err);
  res.status(err.status || 500);
  res.json();
});

module.exports = app;
