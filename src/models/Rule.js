const { Schema, model } = require('mongoose');

const ruleSchema = new Schema({
    guildId: { type: String, required: true },
    rules: [{
        title: String,
        description: String,
        isSubParagraph: { type: Boolean, default: false } // Neu: Markierung für Unterpunkte
    }]
});

module.exports = model('Rule', ruleSchema);