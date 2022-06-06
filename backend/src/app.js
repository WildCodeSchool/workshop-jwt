const express = require("express");
const path = require("path");

const cors = require("cors");

const app = express();

// TODO add cookieParser here

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    optionsSuccessStatus: 200,
    // TODO add credentials here
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const router = require("./router");

app.use(router);

module.exports = app;
