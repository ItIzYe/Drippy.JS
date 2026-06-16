const { Schema, model } = require('mongoose');

const stickyMessageSchema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    messageText: { type: String, required: true },
    lastMessageId: { type: String, default: null },
    messageCount: { type: Number, default: 0 },
    maxMessages: { type: Number, default: 1 }
});

module.exports = model('StickyMessage', stickyMessageSchema);