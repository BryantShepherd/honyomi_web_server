const express = require("express");
const router = express.Router();
const responseUtil = require("../utils/responseUtils");
const auth = require("../config/auth");
const { HTTPErrorMessage } = require("../config");
const userController = require("../controllers/user.controller");
const passport = require("passport");

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

router.post("/auth/login", userController.loginController);

router.post("/auth/register", userController.registerController);

module.exports = router;
