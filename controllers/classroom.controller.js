const responseUtil = require("../utils/responseUtils");
const { userService } = require("../services");
const auth = require("../config/auth");
const { BCRYPT_SALT_ROUND } = require("../config");
const bcrypt = require("bcrypt");
const { UniqueViolationError, ValidationError } = require("objection");
const { HTTPErrorMessage } = require("../config");