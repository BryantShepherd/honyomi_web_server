const {Model} = require("objection");
const knex = require("../databases/knex");
const User = require("./User");

Model.knex(knex);

class Classroom extends Model {
  static get tableName() {
    return "classroom";
  }

  static modifiers = {};

  static get jsonSchema() {
    return {
      type: "object",
      required: ["code", "name", "school"],
      properties: {
        code: { type: "string", maxlength: 6 },
        name: { type: "string", maxlength: 200 },
        school: { type: "string", maxlength: 200 },
      },
    };
  }

  static relationMappings = {
    owner: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      filter: (query) =>
        query.select("id", "name", "email").where("type", "Owner"),
      join: {
        from: "classroom.id",
        through: {
          from: "m_user_classroom.classroom_id",
          to: "m_user_classroom.user_id",
          extra: {
            type: "type",
          },
        },
        to: "user.id",
      },
    },
    students: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      filter: (query) =>
        query.select("id", "name", "email").where("type", "Member"),
      join: {
        from: "classroom.id",
        through: {
          from: "m_user_classroom.classroom_id",
          to: "m_user_classroom.user_id",
        },
        to: "user.id",
      },
    },
    all_members: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      filter: (query) =>
        query.select("id", "name", "email", "type", "joined_date"),
      join: {
        from: "classroom.id",
        through: {
          from: "m_user_classroom.classroom_id",
          to: "m_user_classroom.user_id",
        },
        to: "user.id",
      },
    },
  };
}

module.exports = Classroom;