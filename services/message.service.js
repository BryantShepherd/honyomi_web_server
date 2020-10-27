const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

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

/**
 * Create new conversation with the following members in it
 * @param {Conversation} conversation
 * @param {Array<Number>} memberIds
 */
exports.createNewConversation = async (conversation, memberIds) => {
  const knex = Conversation.knex();
  try {
    let newConvo = Conversation.fromJson(conversation);
    const { id: newConvoId } = await Conversation.query().insert(newConvo);

    return knex("participant").insert(
      memberIds.map((memberId) => {
        return {
          conversation_id: newConvoId,
          user_id: memberId,
        };
      })
    ).then(() => newConvoId);
  } catch (err) {
    throw err;
  }
};
