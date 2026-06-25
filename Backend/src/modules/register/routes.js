const express = require("express");
const security = require("./security");
const answers = require("../../red/answer.js");
const checkRole = require("../../middleware/roleAuth");
const controller = require("./index");
const { registerSchema } = require("../../schema/auth.schema");
const { validateSchema } = require("../../middleware/validator.middleware");

const router = express.Router();

// --- RUTAS DE CONSULTA GENERAL ---

// Listar todos los usuarios (Solo Admin)
router.get("/", security(), checkRole(["administrador"]), all);
// routes.js
router.put("/update-profile", security(), async (req, res, next) => {
  try {
    await controller.updateProfile(req.user.id_usuario, req.body);
    answers.success(req, res, "Perfil actualizado correctamente", 200);
  } catch (err) {
    next(err);
  }
});

// Obtener conteo total de usuarios (Para el Panel de Control)
router.get("/count", async (req, res, next) => {
  try {
    const items = await controller.getCount();
    answers.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
});

// El niño solicita ser especialista
router.post("/solicitar-especialista", security(), async (req, res, next) => {
  try {
    await controller.requestSpecialistRole(req.user.id_usuario);
    answers.success(req, res, "Solicitud enviada correctamente", 200);
  } catch (err) {
    next(err);
  }
});

// El Admin aprueba a un especialista
router.put(
  "/aprobar-especialista/:id",
  security(),
  checkRole(["administrador"]),
  async (req, res, next) => {
    try {
      await controller.approveSpecialist(req.params.id);
      answers.success(req, res, "Usuario ascendido a especialista", 200);
    } catch (err) {
      next(err);
    }
  },
);

// Admin asigna un niño a un especialista
router.post(
  "/asignar-nino",
  security(),
  checkRole(["administrador"]),
  async (req, res, next) => {
    try {
      const { id_especialista, id_ninos } = req.body;
      await controller.assignChildToSpecialist(id_especialista, id_ninos);
      answers.success(req, res, "Niño asignado correctamente", 201);
    } catch (err) {
      next(err);
    }
  },
);
router.delete("/desvincular/:id", security(), async (req, res, next) => {
  try {
    // Verificamos que sea administrador
    if (req.user.nombre_rol !== "administrador") {
      return next(new Error("No tienes permisos para realizar esta acción"));
    }

    await controller.unassignChild(req.params.id);
    answers.success(req, res, "Relación eliminada correctamente", 200);
  } catch (err) {
    next(err);
  }
});
router.get(
  "/mis-ninos",
  security(),
  checkRole(["especialista"]),
  async (req, res, next) => {
    try {
      const items = await controller.getMyStudents(req.user.id_usuario);
      answers.success(req, res, items, 200);
    } catch (err) {
      next(err);
    }
  },
);
router.post("/solicitar-area", security(), async (req, res, next) => {
  try {
    // Usamos el ID que viene del token de seguridad
    await controller.requestSpecialtyChange(
      req.user.id_usuario,
      req.body.especialidad,
    );
    answers.success(req, res, "Solicitud de área técnica enviada", 200);
  } catch (err) {
    next(err);
  }
});

// Ruta para que el Admin apruebe (protegida con checkRole)
router.put(
  "/aprobar-area/:id",
  security(),
  checkRole(["administrador"]),
  async (req, res, next) => {
    try {
      await controller.approveSpecialty(req.params.id);
      answers.success(req, res, "Área técnica aprobada", 200);
    } catch (err) {
      next(err);
    }
  },
);
// --- RUTAS CRUD BÁSICAS ---

router.post(
  "/",
  validateSchema(registerSchema),
  (req, res, next) => {
    if (req.body.id_usuario && req.body.id_usuario !== 0) {
      return security()(req, res, next);
    }
    next();
  },
  add,
);
router.get("/:id", security(), async (req, res, next) => {
  try {
    const idParam = parseInt(req.params.id);
    if (
      req.user.nombre_rol === "administrador" ||
      req.user.id_usuario === idParam
    ) {
      const items = await controller.one(idParam);
      answers.success(req, res, items, 200);
    } else {
      next(new Error("No puedes ver perfiles ajenos"));
    }
  } catch (err) {
    next(err);
  }
});
router.delete("/", security(), del);

router.post("/forgot-password/get-question", async (req, res, next) => {
  try {
    const result = await controller.getQuestionByEmail(req.body.email);
    if (result) {
      answers.success(req, res, result, 200);
    } else {
      answers.error(req, res, "Email no registrado", 404);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/forgot-password/reset", async (req, res, next) => {
  try {
    const { email, respuesta, newPassword } = req.body;
    await controller.resetPassword(email, respuesta, newPassword);
    answers.success(req, res, "Contraseña actualizada con éxito", 200);
  } catch (err) {
    next(err);
  }
});

async function all(req, res, next) {
  try {
    const items = await controller.all();
    answers.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function add(req, res, next) {
  try {
    await controller.add(req.body);
    const message =
      req.body.id_usuario == 0 ? "Usuario Creado" : "Usuario Actualizado";
    answers.success(req, res, message, 201);
  } catch (err) {
    next(err);
  }
}

async function del(req, res, next) {
  try {
    await controller.del(req.body);
    answers.success(req, res, "Usuario eliminado", 200);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
