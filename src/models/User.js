const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    league: { type: String, default: "Beginner" },
    nextLevel: { type: Number, default: 100 }
});

module.exports = mongoose.model('User', UserSchema);
