const Model = require("objection").Model;
const knex = require("../databases/knex");

Model.knex(knex);

class Message extends Model {
  static get tableName() {
    return "message";
  }
}

module.exports = Message;
