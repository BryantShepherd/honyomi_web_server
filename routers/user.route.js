const express = require("express");
const router = express.Router();
const responseUtil = require("../utils/responseUtils");
const { userService } = require("../services");
const auth = require("../config/auth");
const { BCRYPT_SALT_ROUND } = require("../config");
const bcrypt = require("bcrypt");
const { UniqueViolationError, ValidationError } = require("objection");
const { HTTPErrorMessage } = require("../config");

/* GET users listing. */
router.get("/", function (req, res, next) {
  return responseUtil.success(
    res,
    200,
    `respond with a resource to ${req.connection.remoteAddress}`
  );
});

router.get("/err", (req, res, next) => {
  try {
    throw new Error("Some kind of error");
  } catch (err) {
    err.status = 418;
    err.httpMessage = HTTPErrorMessage.DEFAULT;
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await userService.authenticate(email, password);
    let token = auth.createUserToken(user);
    return responseUtil.success(res, 200, { user, token });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
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
});

module.exports = router;
