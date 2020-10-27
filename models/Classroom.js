const {Model} = require("objection");
const knex = require("../databases/knex");
const User = require("./User");

Model.knex(knex);

class Classroom extends Model {
  static get tableName() {
    return "classroom";
  }

  static modifiers = {

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

  static relationMappings = {
    owner: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: "classroom.id",
        through: {
          from: "class_owner.classroom_id",
          to: "class_owner.teacher_id"
        },
        to: "user.id"
      }
    }
  }
}

module.exports = Classroom;