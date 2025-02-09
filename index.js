const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  console.error(`Environment file ${envFile} not found!`);
  process.exit(1);
}

require("./database/pg.db");
const routes = require("./routes/index.routes");
const { error, genLog } = require("./services/response.service");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/web", routes);

process.on("uncaughtException", (err) => {
  error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  const errorMessage = reason instanceof Error ? reason.stack || reason.message : String(reason);
  error(`Unhandled Rejection: ${errorMessage}`);
  process.exit(1);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  genLog(true, `SERVER :: ${process.env.NODE_ENV} :: PORT: ${port}`);
});

module.exports = app;
