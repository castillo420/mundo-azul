const TABLE = "usuario";
const bcrypt = require("bcrypt");
const auth = require("../../authlog"); // solo para assignToken

module.exports = function (dbInyectada) {
  let db = dbInyectada;
  if (!db) {
    db = require("../../DB/mySQL");
  }

  // Login
  async function login(identifier, password) {
    let date = await db.query(TABLE, { name: identifier });

    if (!date) {
      date = await db.query(TABLE, { email: identifier });
    }

    if (!date) {
      const error = new Error("Ingresaste algo mal");
      error.statusCode = 404;
      throw error;
    }

    const ans = await bcrypt.compare(password, date.password);

    if (!ans) {
      const error = new Error("Ingresaste algo mal");
      error.statusCode = 401;
      throw error;
    }

    return auth.assignToken({ ...date });
  }

  async function add(data) {
    let date = await db.query(TABLE, { name: data.name });
    if (date) {
      const error = new Error(
        "Ya existe un usuario con ese nombre de usuario.",
      );
      error.statusCode = 400;
      throw error;
    }

    date = await db.query(TABLE, { email: data.email });
    if (date) {
      const error = new Error(
        "Ya existe un usuario con ese correo electrónico.",
      );
      error.statusCode = 400;
      throw error;
    }
    const userCount = await db.countAll(TABLE);
    const nombre_rol = userCount === 0 ? "administrador" : "niño";
    const userData = {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password.toString(), 5),
      nombre_rol: nombre_rol,
      especialidad: null,
      pregunta_seguridad: data.pregunta_seguridad,
      respuesta_seguridad: data.respuesta_seguridad,
    };
    return db.add(TABLE, userData);
  }

  async function insert(data) {
    const userData = {
      id_usuario: data.id_usuario,
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password.toString(), 5),
    };
    return db.insert(TABLE, userData);
  }

  // Actualizar usuario
  async function update(id_usuario, data) {
    const updateData = {
      name: data.name,
      email: data.email,
    };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password.toString(), 5);
    }
    return db.update(TABLE, id_usuario, updateData, "id_usuario");
  }

  // Obtener perfil
  async function getProfile(id_usuario) {
    const profile = await db.getUserProfileById(id_usuario);
    if (!profile) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return profile;
  }

  return {
    login,
    add,
    insert,
    update,
    getProfile,
  };
};
