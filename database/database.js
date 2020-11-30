const Sequelize = require("sequelize");
const connection = new Sequelize('nodeblog', 'root', 'Pripyat@123',{
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00'
});

module.exports = connection;