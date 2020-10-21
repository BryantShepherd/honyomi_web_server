const express = require("express");
const router = express.Router();
const responseUtil = require("../utils/responseUtils");
const auth = require("../config/auth");
const { HTTPErrorMessage } = require("../config");
const passport = require("passport");
const classController = require("../controllers/class.controller");

router.get(
  "/:classroomId/:conversationId/message",
  auth.jwtAuth(),
  classController.conversationMessageController
);

module.exports = router;
