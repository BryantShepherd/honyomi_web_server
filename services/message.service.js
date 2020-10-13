const Message = require("../models/Message");

/**
 * Insert a new message.
 * @param {Message} message 
 */
exports.insertMessage = (message) => {
  let newMessage = Message.fromJson(message);
  return Message.query().insert(newMessage);
};
