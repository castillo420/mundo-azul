const express = require("express");
const controller = require("./index");
const { validateSchema } = require("../../middleware/validator.middleware");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const { loginSchema } = require("../../schema/auth.schema");
const authlog = require("../../authlog/index");

const router = express.Router();

router.post("/login", validateSchema(loginSchema), login);

async function login(req, res, next) {
  try {
    const token = await controller.login(req.body.name, req.body.password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({ mensaje: "hola" });
  } catch (err) {
    next(err);
  }
}

router.get("/verify", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    res.json({ name: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None", // Igual que al setearla
  });
  return res.json({ message: "Logged out" });
});

module.exports = router;
