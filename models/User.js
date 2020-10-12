const Model = require("objection").Model;
const knex = require("../databases/knex");

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "user";
  }

  static modifiers = {
    excludePassword(builder) {
      return builder.select(
        "user.id",
        "user.name",
        "user.email",
        "user.role_id"
      );
    },

    includeRole(builder) {
      return builder
        .select(
          "user.id",
          "user.name",
          "user.email",
          "user.password",
          "role.name as role"
        )
        .innerJoin("role", "user.role_id", "role.id");
    },
  };

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "email", "password", "role_id"],
      properties: {
        name: { type: "string", maxlength: 200 },
        email: { type: "email", maxlength: 200 },
        password: { type: "string", maxlength: 100, minlength: 8 },
        role_id: { type: "number" },
      },
    };
  }
}

module.exports = User;
