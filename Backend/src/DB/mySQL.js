const mysql = require("mysql2");
const config = require("../config");

const dbconfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port,
};

let conexion;

function conMysql() {
  conexion = mysql.createConnection(dbconfig);
  conexion.connect((err) => {
    if (err) {
      console.log("[db error", err);
      setTimeout(conMysql, 200);
    } else {
      console.log("DB connected");
    }
  });

  conexion.on("error", (err) => {
    console.log("[db err]", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      conMysql();
    } else {
      throw err;
    }
  });
}

conMysql();

function all(table) {
  return new Promise((resolve, reject) => {
    conexion.query(`SELECT * FROM ${table}`, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function one(table, id) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `SELECT * FROM ${table} WHERE id_usuario= ?`,
      id,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function add(table, date) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ?`,
      [date, date],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function insert(table, data) {
  return new Promise((resolve, reject) => {
    conexion.query(`INSERT INTO ${table} SET ?`, data, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

function update(table, id, data, idField = "id_usuario") {
  return new Promise((resolve, reject) => {
    conexion.query(
      `UPDATE ${table} SET ? WHERE ${idField} = ?`,
      [data, id],
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
}

function del(table, date) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `DELETE FROM ${table} WHERE id_usuario = ?`,
      date.id_usuario,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function query(table, consult) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `SELECT * FROM ${table} WHERE ?`,
      consult,
      (error, result) => {
        return error ? reject(error) : resolve(result[0]);
      }
    );
  });
}

function queryAll(table, consult) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `SELECT * FROM ${table} WHERE ?`,
      consult,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function countAll(table) {
  return new Promise((resolve, reject) => {
    conexion.query(
      `SELECT COUNT(*) as count FROM ${table}`,
      (error, result) => {
        return error ? reject(error) : resolve(result[0].count);
      }
    );
  });
}

// NUEVA FUNCIÓN: Permite ejecutar cualquier SQL desde el controlador
function customQuery(sql, params) {
  return new Promise((resolve, reject) => {
    conexion.query(sql, params, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

module.exports = {
  all,
  one,
  add,
  insert,
  update,
  del,
  queryAll,
  countAll,
  query,
  customQuery,
};
