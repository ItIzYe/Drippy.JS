const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    Guild: {
        type: String,
        required: true,
        unique: true, // pro Guild nur ein Setup
    },
    Category: {
        type: String,
        required: true,
    },
    LogChannel: {
        type: String,
        required: true,
    },
    Tickets: [
        {
            ChannelId: String,
            OwnerId: String,
            Reason: String,
            CreatedAt: {
                type: Date,
                default: Date.now,
            },
            Closed: {
                type: Boolean,
                default: false,
            },
        },
    ],
});

module.exports = model('Ticket', ticketSchema);
