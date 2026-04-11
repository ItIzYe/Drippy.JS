const { Schema, model } = require('mongoose');

const ruleSchema = new Schema({
    guildId: { type: String, required: true },
    rules: [{
        title: String,
        description: String
    }]
});

module.exports = model('Rule', ruleSchema);