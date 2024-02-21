require("dotenv").config();
require("./src/configs/firebaseAdmin");
const express = require("express");
const logger = require("morgan");
const usersRouter = require("./src/routes/users");
const categoriesRouter = require("./src/routes/categories");
const healthCheckRouter = require("./src/routes/healthCheck");
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
app.use("/api/v1/health", healthCheckRouter);

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.use((err, req, res) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status,
    },
  });
});

module.exports = app;
