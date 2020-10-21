const Message = require("../models/Message");

/**
 * Insert a new message.
 * @param {Message} message
 */
exports.insertMessage = (message) => {
  let newMessage = Message.fromJson(message);
  return Message.query().insert(newMessage);
};

exports.getConversationMessages = (conversationId) => {
  //TODO: Use pagination
  return Message.query()
    .select(
      "message.id",
      "conversation_id as conversationId",
      "message",
      "message.created_at as createdAt"
    )
    .where("conversation_id", conversationId)
    .withGraphFetched("[sender(idAndName), attachment]");
};
