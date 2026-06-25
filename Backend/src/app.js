const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const config = require("./config");
const cookieParser = require("cookie-parser");

const progreso = require("./modules/progreso/routes");
const register = require("./modules/register/routes");
const auth = require("./modules/auth/routes");
const error = require("./red/errors");

const app = express();

//middleware
app.use(
  cors({
    origin: "https://mundo-azul-s5ug.vercel.app",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//configura
app.set("port", config.app.port);

//rutas
app.use("/api/progreso", progreso);
app.use("/api/register", register);
app.use("/api/auth", auth);
app.use(error);

module.exports = app;
