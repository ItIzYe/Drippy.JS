const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    targetType: { type: String, required: true },
    targetUser: { type: String, required: true, unique: true },
    ratings: [
        {
            userId: { type: String, required: true },
            stars: { type: Number, required: true, min: 1, max: 5 },
            text: { type: String, default: "" },
            isAnonym: { type: Boolean, default: false },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Feedback', feedbackSchema, 'feedbacks_v2');