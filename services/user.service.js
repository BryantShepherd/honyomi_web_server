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
