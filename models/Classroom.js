const {Model} = require("objection");
const knex = require("../databases/knex");
const User = require("./User");
const Setting = require("./Setting");

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
      filter: query => query.select("id", "name", "email"),
      join: {
        from: "classroom.id",
        through: {
          from: "class_owner.classroom_id",
          to: "class_owner.teacher_id"
        },
        to: "user.id"
      }
    },
    students: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      filter: query => query.select("id", "name", "email"),
      join: {
        from: "classroom.id",
        through: {
          from: "m_student_classroom.classroom_id",
          to: "m_student_classroom.student_id"
        },
        to: "user.id"
      }
    },

    setting: {
      relation: Model.HasOneRelation,
      modelClass: Setting,
      join: {
        from: "classroom.id",
        to: "setting.classroom_id"
      }
    },
  }
}

module.exports = Classroom;