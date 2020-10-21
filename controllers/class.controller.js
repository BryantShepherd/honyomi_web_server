const responseUtil = require("../utils/responseUtils");
const { userService } = require("../services");
const auth = require("../config/auth");
const { BCRYPT_SALT_ROUND } = require("../config");
const bcrypt = require("bcrypt");
const { UniqueViolationError, ValidationError } = require("objection");
const { HTTPErrorMessage } = require("../config");
const { messageService } = require("../services");

exports.conversationMessageController = async (req, res, next) => {
  const { classroomId, conversationId } = req.params;
  try {
    let messages = await messageService.getConversationMessages(conversationId);
    responseUtil.success(res, 200, messages);
  } catch (err) {
    next(err);
  }
};
