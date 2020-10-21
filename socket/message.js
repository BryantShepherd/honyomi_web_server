const event = require("../config").SocketIOEvent.message;
const Message = require("../models/Message");
const { messageService, userService } = require("../services");
const scheduleUtil = require("../utils/scheduleUtils");
const debug = require("debug")("remind-clone:socket:message");

class MessageNamespace {
  constructor(socket, nsp) {
    this.socket = socket;
    this.nsp = nsp;
  }

  init() {
    this.joinConvoChannels();
    this.socket.on(event.NEW_MESSAGE, this._newMessageHandler.bind(this));
  }

  joinConvoChannels() {
    let userId = this.socket.user.id;
    userService.getUserConversationIds(userId).then((arr) => {
      arr.forEach((id) => {
        this.socket.join(`convo#${id}`);
      });
    });
  }

  /**
   * @alias NewMessageHandlerCallback
   * @function
   * @param {Object} ackMessage
   */

  /**
   * Handle NEW_MESSAGE event. This handler will first
   * create a new return message, then invoke the callback
   * to let the sender know that the message was sent successfully.
   * Then, it will insert the new message to the database, getting
   * its ID and emit the new message to all participant in
   * that conversation.
   * @param {Object} message
   * @param {Object} message.sender
   * @param {Object} message.conversation
   * @param {Object} message.message
   * @param {Boolean} [message.canReply]
   * @param {Object} [message.attachment]
   * @param {Date | String} message.createdAt
   * @param {Date | String} [message.scheduledAt]
   * @param {NewMessageHandlerCallback} fn - Notify sender that the message has been received
   * @private
   */
  async _newMessageHandler(message, fn) {
    let broadcastMessage = {
      sender: message.sender,
      message: message.message.richText || message.message.text,
      createdAt: message.createdAt,
      conversationId: message.conversation.id,
      canReply: message.canReply || true,
      attachment: message.attachment,
    };
    //TODO: Implement scheduled message
    if (fn) fn(broadcastMessage);
    try {
      let newMessage = await messageService.insertMessage({
        sender_id: message.sender.id,
        conversation_id: message.conversation.id,
        message: message.message.richText || message.message.text,
        message_text: message.message.text,
        attachment_id: message.attachment ? message.attachment.id : undefined,
      });
      broadcastMessage.id = newMessage.id;
      let convoChannel = `convo#${broadcastMessage.conversationId}`;
      this.nsp.in(convoChannel).emit(event.NEW_MESSAGE, broadcastMessage);
    } catch (err) {
      debug(err);
    }
  }
}

/**
 * Handle all events coming to this namespace.
 * socket will have an extra properties called `user`
 * because we implemented socket authentication earlier.
 * @param {import("socket.io").Socket} socket
 * @param {import("socket.io").Namespace} nsp
 */
exports.handleEvents = (socket, nsp) => {
  const messageNsp = new MessageNamespace(socket, nsp);
  messageNsp.init();
};
