const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    day: { type: Number, required: true },
    month: { type: Number, required: true }
});

birthdaySchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('Birthday', birthdaySchema);