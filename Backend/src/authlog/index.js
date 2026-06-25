const jwt = require("jsonwebtoken");
const config = require("../config");
const err = require("../middleware/errors");

const secret = config.jwt.secret;

function assignToken(date) {
  return jwt.sign(date, secret); //token
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

const checkToken = {
  confToken: function (req, id) {
    if (id === 0) {
      // Esto solo extrae el usuario del token y lo pone en req.user
      decryptHeader(req);
      return;
    }

    const decrypt = decryptHeader(req);

    // REGLA DE ORO: Si es administrador, puede editar cualquier ID
    if (decrypt.nombre_rol === "administrador") {
      return;
    }

    if (decrypt.id_usuario !== id) {
      throw err("No tienes privilegios para hacer esto", 401);
    }
  },
};
function getToken(authOK) {
  if (!authOK) {
    throw err("No hay token", 401);
  }
  if (authOK.indexOf("Bearer") === -1) {
    throw err("Formato invalido", 401);
  }

  let token = authOK.replace("Bearer", "").trim();
  return token;
}

function decryptHeader(req) {
  // Primero intentamos sacar el token de la cabecera Authorization
  const authHeader = req.headers.authorization;
  let token = "";

  if (authHeader) {
    token = getToken(authHeader);
  } else if (req.cookies && req.cookies.token) {
    // Si no hay cabecera, lo buscamos en la cookie "token"
    token = req.cookies.token;
  }

  if (!token) {
    throw err("No hay token", 401);
  }

  const decrypt = verifyToken(token);
  req.user = decrypt;
  return decrypt;
}

module.exports = {
  assignToken,
  checkToken,
  decryptHeader,
};
