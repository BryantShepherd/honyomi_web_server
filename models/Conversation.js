const Model = require("objection").Model;
const knex = require("../databases/knex");

Model.knex(knex);

class Conversation extends Model {
  static get tableName() {
    return "conversation";
  }
}

module.exports = Conversation;
