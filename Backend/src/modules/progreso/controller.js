const TABLE = "progreso";

module.exports = function (dbInyectada) {
  let db = dbInyectada;
  if (!db) {
    db = require("../../DB/mySQL");
  }
  async function addFeedback(data) {
    const feedbackData = {
      id_progreso: data.id_progreso, // Si es 0 crea, si no actualiza
      id_usuario: data.id_usuario, // El alumno
      id_especialista: data.id_especialista, // El profe que lo evalúa
      puntos: data.puntos,
      nombre_juego: data.nombre_juego,
      nivel_dificultad: data.nivel_dificultad,
      descripcion: data.descripcion,
      recomendacion_especialista: data.recomendacion_especialista,
    };

    return db.add(TABLE, feedbackData);
  }

  // Ver progreso de un alumno específico (para el profesor)
  async function getStudentProgress(id_usuario) {
    return db.queryAll(TABLE, { id_usuario });
  }

  function all() {
    return db.all(TABLE);
  }

  function one(id) {
    return db.one(TABLE, id);
  }
  function add(body) {
    return db.add(TABLE, body);
  }

  function del(body) {
    return db.del(TABLE, body);
  }
  return {
    all,
    one,
    add,
    del,
  };
};
