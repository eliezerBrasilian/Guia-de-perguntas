const Sequelize = require("sequelize");

const connection = new Sequelize("guiaPerguntas", "root", "147258", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = connection;
