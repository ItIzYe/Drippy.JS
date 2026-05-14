const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema({
    caseId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userName: String,
    status: { type: String, default: 'open' }, // 'open' oder 'closed'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appeal', appealSchema);