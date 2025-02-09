const dotenv = require("dotenv");
dotenv.config();

let config = {};

if (process.env.NODE_ENV === "development") {
  import("./dev.config")
    .then((devConfig) => {
      config = devConfig.default;
    })
    .catch((err) => {
      console.error("Error loading development config:", err);
    });
} else {
  console.error("Conflict at node environment");
}

export { config };
