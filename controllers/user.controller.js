const responseUtil = require("../utils/responseUtils");
const { userService } = require("../services");
const auth = require("../config/auth");
const { BCRYPT_SALT_ROUND } = require("../config");
const bcrypt = require("bcrypt");
const { UniqueViolationError, ValidationError } = require("objection");
const { HTTPErrorMessage } = require("../config");

exports.loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await userService.authenticate(email, password);
    let token = auth.createUserToken(user);
    return responseUtil.success(res, 200, { user, token });
  } catch (err) {
    next(err);
  }
};

exports.registerController = async (req, res, next) => {
  const { name, email, password, role_id } = req.body;

  let hashedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUND);
  let newUser = {
    name,
    email,
    password: hashedPassword,
    role_id,
  };

  try {
    let user = await userService.createUser(newUser);
    delete user.password;
    return responseUtil.success(res, 201, user);
  } catch (err) {
    if (err instanceof UniqueViolationError) {
      err.status = 409;
      err.httpMessage = HTTPErrorMessage.EMAIL_ALREADY_EXISTED;
    } else if (err instanceof ValidationError) {
      err.status = 400;
      err.httpMessage = HTTPErrorMessage.REQUIRED_FIELDS_MISSING;
    }
    next(err);
  }
};

exports.conversationController = async (req, res, next) => {
  const currentUser = req.user;
  try {
    let conversations = await userService.getUserConversations(currentUser.id);
    return responseUtil.success(res, 200, conversations);
  } catch (err) {
    next(err);
  }
};

exports.googleRedirectController = (req, res, next) => {
  //TODO: Implement Google Redirect Controller
  return responseUtil.success(res, 200);
};
