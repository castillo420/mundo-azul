const express = require("express");
const security = require("../register/security"); // Reutilizamos tu lógica de token
const checkRole = require("../../middleware/roleAuth");
const answers = require("../../red/answer.js");
const controller = require("./index");
const router = express.Router();

// 1. Un estudiante ve su PROPIO progreso
router.get("/mi-progreso", security(), async (req, res, next) => {
  try {
    const items = await controller.one(req.user.id_usuario);
    answers.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  security(),
  checkRole(["especialista", "administrador"]),
  async (req, res, next) => {
    try {
      // Forzamos que el id_especialista sea el del usuario logueado
      const data = { ...req.body, id_especialista: req.user.id_usuario };
      const items = await controller.add(data);
      answers.success(req, res, "Progreso/Recomendación guardada", 201);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/alumno/:id",
  security(),
  checkRole(["especialista", "administrador"]),
  async (req, res, next) => {
    try {
      const items = await controller.getStudentProgress(req.params.id);
      answers.success(req, res, items, 200);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
