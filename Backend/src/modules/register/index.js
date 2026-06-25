const db = require("../../DB/mySQL");
const ctrl = require("./controller");

module.exports = ctrl(db);
