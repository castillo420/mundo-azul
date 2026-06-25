const TABLE = "usuario";
const bcrypt = require("bcrypt");
const auth = require("../auth");

const PREGUNTAS_VALIDAS = [
  "¿Cuál es el nombre de tu primera mascota?",
  "¿En qué ciudad naciste?",
  "¿Cuál es tu comida favorita?",
];
const ESPECIALIDADES_PERMITIDAS = [
  "Psicopedagogo/a",
  "Psicologo/a",
  "Acompañante Terapéutico",
];

module.exports = function (dbInyectada) {
  let db = dbInyectada;
  if (!db) {
    db = require("../../DB/mySQL");
  }

  // Dentro de tu module.exports en el controlador
  async function all() {
    // u = Tabla de usuarios (el niño)
    // en = Tabla de relación
    // esp = Tabla de usuarios otra vez (para sacar el nombre del especialista)
    const sql = `
        SELECT 
            u.id_usuario, 
            u.name, 
            u.email, 
            u.nombre_rol, 
            u.estado_solicitud, 
            u.especialidad,
            u.estado_especialidad,
            en.id_especialista as asignado_a,
            esp.name as nombre_especialista
        FROM usuario u
        LEFT JOIN especialista_ninos en ON u.id_usuario = en.id_ninos
        LEFT JOIN usuario esp ON en.id_especialista = esp.id_usuario
    `;

    // Usamos la función customQuery que definiste en mySQL.js
    return await db.customQuery(sql);
  }
  function one(id) {
    return db.one(TABLE, id);
  }

  async function add(body) {
    console.log("Cuerpo recibido en el registro:", body);
    let insertId = 0;
    try {
      if (body.id_reg === 0) {
        // --- NUEVA VALIDACIÓN ROBUSTA ---
        // 1. Limpiamos la pregunta que viene del body (quitamos espacios raros al inicio/final)
        const preguntaRecibida = body.pregunta_seguridad
          ? body.pregunta_seguridad.trim()
          : "";

        // 2. Verificamos si existe en nuestra lista
        if (!PREGUNTAS_VALIDAS.includes(preguntaRecibida)) {
          console.log("Pregunta rechazada:", `"${preguntaRecibida}"`); // Esto te ayudará a ver el error en consola
          const err = new Error(
            "La pregunta de seguridad seleccionada no es válida.",
          );
          err.statusCode = 400;
          throw err;
        }

        // 2. REGISTRO: Enviamos todos los campos necesarios, incluyendo seguridad
        const res = await auth.add({
          name: body.name,
          email: body.email,
          password: body.password,
          pregunta_seguridad: preguntaRecibida, // Usamos la limpia
          respuesta_seguridad: body.respuesta_seguridad.trim().toLowerCase(),
        });

        insertId = res.insertId;
      } else {
        // 3. ACTUALIZACIÓN: Lógica para editar un usuario existente
        const res = await auth.update(body.id_usuario, {
          name: body.name,
          email: body.email,
          password: body.password,
        });
        insertId = body.id_usuario;
      }

      return { insertId };
    } catch (error) {
      // Manejo de errores de duplicados (Email o Nombre ya existentes)
      if (error.code === "ER_DUP_ENTRY") {
        const mensaje = error.sqlMessage.includes("email")
          ? "Ya existe un usuario con ese correo electrónico"
          : "Ya existe un usuario con ese nombre de usuario";
        const err = new Error(mensaje);
        err.statusCode = 400;
        throw err;
      }
      throw error;
    }
  }

  function del(body) {
    return db.del(TABLE, body);
  }

  async function updatePermissions(id_target, data) {
    const updateData = {};
    if (data.nombre_rol) updateData.nombre_rol = data.nombre_rol;
    if (data.especialidad !== undefined)
      updateData.especialidad = data.especialidad;

    return db.update(TABLE, id_target, updateData, "id_usuario");
  }
  async function updateProfile(id, data) {
    const updatedData = { name: data.name };

    // Solo si el usuario envió una contraseña, la procesamos
    if (data.password && data.password.trim() !== "") {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    return await db.update("usuario", id, updatedData);
  }
  // Obtener niños asignados a un especialista usando customQuery
  async function getMyStudents(id_especialista) {
    const sql = `
    SELECT u.id_usuario, u.name, u.email, u.especialidad, u.fecha_regis, u.nombre_rol
    FROM usuario u
    JOIN especialista_ninos en ON u.id_usuario = en.id_ninos
    WHERE en.id_especialista = ?`;

    return await db.customQuery(sql, [id_especialista]);
  }

  // Conteo para los widgets del Panel de Control usando countAll
  async function getCount() {
    // Usamos la función countAll que ya existe en mySQL.js
    const count = await db.countAll(TABLE);
    return { count }; // Lo devolvemos como objeto para el frontend
  }

  // El niño solicita cambio de rol
  async function requestSpecialistRole(id_usuario) {
    return db.update(
      TABLE,
      id_usuario,
      { estado_solicitud: "pendiente" },
      "id_usuario",
    );
  }

  async function approveSpecialist(id_usuario) {
    try {
      // 1. Actualizamos el rol del usuario a especialista
      await db.update(
        TABLE,
        id_usuario,
        {
          nombre_rol: "especialista",
          estado_solicitud: "aprobada",
        },
        "id_usuario",
      );

      // 2. Borramos al usuario de la tabla de asignaciones
      // (Ya que ahora él es quien asignará, no quien es asignado)
      const sqlDelete = `DELETE FROM especialista_ninos WHERE id_ninos = ?`;
      await db.customQuery(sqlDelete, [id_usuario]);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
  async function requestSpecialtyChange(id_usuario, especialidad) {
    if (!ESPECIALIDADES_PERMITIDAS.includes(especialidad)) {
      const error = new Error("La especialidad seleccionada no es válida.");
      error.statusCode = 400;
      throw error;
    }

    const sql =
      "UPDATE usuario SET especialidad = ?, estado_especialidad = 'pendiente' WHERE id_usuario = ?";
    return await db.customQuery(sql, [especialidad, id_usuario]);
  }
  async function approveSpecialty(id_usuario) {
    // 1. Buscamos al usuario directamente con una consulta SQL limpia para estar seguros
    const rows = await db.customQuery(
      "SELECT especialidad FROM usuario WHERE id_usuario = ?",
      [id_usuario],
    );

    const user = rows[0]; // Obtenemos el primer resultado

    // 2. Verificamos si realmente existe el usuario y si tiene una solicitud
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.especialidad) {
      throw new Error(
        "El usuario no tiene una especialidad pendiente de aprobación",
      );
    }

    // 3. Movemos la especialidad solicitada al campo oficial y limpiamos
    const sqlUpdate = `
        UPDATE usuario 
        SET 
            especialidad = ?, 
            estado_especialidad = 'aprobado' 
        WHERE id_usuario = ?
    `;

    return await db.customQuery(sqlUpdate, [user.especialidad, id_usuario]);
  }

  // El administrador vincula a un niño con un especialista
  async function assignChildToSpecialist(id_especialista, id_ninos) {
    return db.add("especialista_ninos", {
      id_especialista,
      id_ninos,
      fecha_asignacion: new Date(),
    });
  }
  async function unassignChild(id_ninos) {
    const sql = `DELETE FROM especialista_ninos WHERE id_ninos = ?`;
    return await db.customQuery(sql, [id_ninos]);
  }

  // 1. Buscar la pregunta del usuario por email
  async function getQuestionByEmail(email) {
    const sql = "SELECT pregunta_seguridad FROM usuario WHERE email = ?";
    const result = await db.customQuery(sql, [email]);
    return result[0]; // Devolvemos la pregunta
  }

  // 2. Verificar respuesta y cambiar contraseña
  async function resetPassword(email, respuesta, newPassword) {
    // Primero buscamos al usuario
    const user = await db.customQuery(
      "SELECT respuesta_seguridad FROM usuario WHERE email = ?",
      [email],
    );

    if (user.length === 0) throw new Error("Usuario no encontrado");

    // Verificamos si la respuesta coincide (puedes usar toLowerCase para evitar errores de mayúsculas)
    if (user[0].respuesta_seguridad.toLowerCase() !== respuesta.toLowerCase()) {
      throw new Error("La respuesta es incorrecta");
    }

    // Si es correcta, encriptamos la nueva clave y actualizamos
    const hashedPass = await bcrypt.hash(newPassword, 10);
    return await db.customQuery(
      "UPDATE usuario SET password = ? WHERE email = ?",
      [hashedPass, email],
    );
  }

  return {
    all,
    one,
    add,
    del,
    updatePermissions,
    updateProfile,
    getMyStudents,
    getCount,
    requestSpecialistRole,
    approveSpecialist,
    assignChildToSpecialist,
    unassignChild,
    getQuestionByEmail,
    resetPassword,
    requestSpecialtyChange,
    approveSpecialty,
  };
};
