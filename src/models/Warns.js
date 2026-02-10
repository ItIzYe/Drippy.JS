const {Schema, model} = require('mongoose');

const warnSchema = new Schema({
    guildId: { type: String, required: true },
    userId: {type: String, required: true},
    moderatorId: {type: String, required: true},
    reason: {type: String, required: true},
    caseId: {type: String, required: true},
    timestamp: {type: Date, default: Date.now}
});

module.exports = model('Warns', warnSchema);
