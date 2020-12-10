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

/**
 * @param {Object} messageWithAttachment
 * @param {Object} messageWithAttachment.attachment
 */
exports.insertMessageWithAttachment = async (messageWithAttachment) => {
  return Message.query().insertGraph(messageWithAttachment);
};

exports.getConversationMessages = (conversationId) => {
  //TODO: Use pagination
  return Message.query()
    .select(
      "message.id",
      "conversation_id as conversationId",
      "message",
      "message.message_text as messageText",
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
    const resConvo = await Conversation.query().insert(newConvo);

    await knex("participant").insert(
      memberIds.map((memberId) => {
        return {
          conversation_id: newConvo.id,
          user_id: memberId,
        };
      })
    );

    return resConvo;
  } catch (err) {
    throw err;
  }
};

exports.getConversationMembers = (convoId) => {
  const knex = Conversation.knex();

  return knex("user")
    .select("id", "name", "avatar_url")
    .innerJoin("participant", "user.id", "participant.user_id")
    .where("participant.conversation_id", convoId);
};

exports.getConversationDetail = (convoId) => {
  return Conversation.query().findById(convoId).withGraphFetched("members");
};

/**
 * Get 2 users ' private conversation.
 * @param {Number} user1Id
 * @param {Number} user2Id
 * @returns {Promise<Number>} Conversation ID if found.
 */
exports.getTwoUsersConvoId = (user1Id, user2Id, classroomId) => {
  const knex = Conversation.knex();

  return knex({ p: "participant" })
    .select("c.id")
    .innerJoin({ c: "conversation" }, "c.id", "p.conversation_id")
    .whereIn("p.user_id", [user1Id, user2Id])
    .andWhere("c.type", "single")
    .andWhere("c.classroom_id", classroomId)
    .groupBy("c.id")
    .havingRaw("count(c.id) = 2")
    .then((results) => {
      if (results.length > 0) {
        return results[0].id;
      }
      return null;
    });
};
