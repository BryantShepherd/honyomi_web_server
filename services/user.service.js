const User = require("../models/User");
const bcrypt = require("bcrypt");
const { HTTPErrorMessage } = require("../config");

exports.getUserById = (id) => {
  return User.query().findById(id);
};

exports.authenticate = (email, password) => {
  return User.query()
    .findOne({ email })
    .modify("includeRole")
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        let authErr = new Error(HTTPErrorMessage.WRONG_EMAIL_OR_PASSWORD);
        authErr.status = 401;
        throw authErr;
      }
      delete user.password;
      return user;
    });
};

exports.createUser = (user) => {
  const newUser = User.fromJson(user);
  return User.query().insert(newUser);
};

/**
 * Returns ids of the conversation this user is in.
 * @param {Number} userId
 * @returns {Promise<Array>} conversationIds
 */
exports.getUserConversationIds = (userId) => {
  const knex = User.knex();
  return knex("participant")
    .select("conversation_id")
    .where("user_id", userId)
    .then((res) => res.map((item) => item["conversation_id"]));
};

exports.getUserConversations = (userId) => {
  const knex = User.knex();
  return knex
    .raw(
      "select c.id, coalesce(c.name, group_concat(u.name separator ', ')) as conversation_name ,\
     c.`type` from participant p inner join conversation c on c.id = p.conversation_id \
     inner join user u on u.id = p.user_id \
     where p.conversation_id in \
     (select p2.conversation_id from participant p2 where p2.user_id = :userId) \
     and user_id != :userId \
     group by c.id;",
      {
        userId,
      }
    )
    .then((res) => {
      let data = res[0];
      return data;
    });
};
