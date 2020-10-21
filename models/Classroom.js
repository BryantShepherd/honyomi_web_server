const {Model} = require("objection");
const knex = require("../databases/knex");

Model.knex(knex);

class Classroom extends Model {
  static get tableName() {
    return "classroom";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["code", "name", "school"],
      properties: {
        code: {type: "string", maxlength: 6},
        name: {type: "string", maxlength: 200},
        school: {type: "string", maxlength: 200},
      },
    };
  }
}

module.exports = Classroom;