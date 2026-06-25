const auth = require("../../authlog");
const err = require("../../middleware/errors");

module.exports = function checkToken() {
  function middleware(req, res, next) {
    // Si es un GET a la raíz (listar todos), solo verificamos que haya un token válido
    // La validación de si es ADMIN la hará el middleware checkRole que creamos
    if (req.method === "GET" && !req.params.id) {
      auth.checkToken.confToken(req, 0); // El 0 permite que pase la validación de ID
      return next();
    }

    // Para POST/PUT/DELETE, seguimos usando la lógica de id_reg
    const id = req.body && req.body.id_reg ? req.body.id_reg : 0;

    auth.checkToken.confToken(req, id);
    next();
  }
  return middleware;
};
