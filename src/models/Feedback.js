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

// ALT:
// module.exports = mongoose.model('Feedback', feedbackSchema);

// NEU: Wir hängen ein '_v2' an. Das zwingt MongoDB, eine komplett neue, saubere Collection zu erstellen!
module.exports = mongoose.model('Feedback', feedbackSchema, 'feedbacks_v2');