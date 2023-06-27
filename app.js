import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import db from "./db.js";

const PORT = process.env.PORT || 3000;
const ORIGINS = process.env.CORS_ORIGINS.split(",").map((origin) =>
  origin.trim()
);

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: "Content-Type",
  })
);
app.use(bodyParser.json());

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

app.listen(PORT, () => {
  console.log(`Application listening at http://localhost:${PORT}`);
  db();
  routes(app);
});
