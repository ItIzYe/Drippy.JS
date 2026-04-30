const mongoose = require('mongoose');

const VerifySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String }, // Optional, falls du User-Logs willst
    roleId: { type: String }, // HIER speichern wir die konfigurierte Rolle
    verifiedAt: { type: Date }
});

module.exports = mongoose.model('Verify', VerifySchema);