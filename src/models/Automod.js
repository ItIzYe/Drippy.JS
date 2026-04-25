const mongoose = require('mongoose');

const AutoModSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    customBannedWords: [String],
    allowLinksFromBots: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true },
    
    // Neues Feld für detaillierte Kanal-Einstellungen
    channelSettings: [
        {
            channelId: { type: String, required: true },
            allowLinks: { type: Boolean, default: false },
            allowImages: { type: Boolean, default: false }
        }
    ]
});

module.exports = mongoose.model('Automod', AutoModSchema);