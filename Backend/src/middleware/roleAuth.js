const err = require("./errors");

const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    // req.user viene del token decodificado en authlog
    if (!req.user || !rolesPermitidos.includes(req.user.nombre_rol)) {
      return next(
        err("Acceso denegado: No tienes los permisos necesarios", 403)
      );
    }
    next();
  };
};

module.exports = checkRole;
