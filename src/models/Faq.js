const { Schema, model } = require('mongoose');

const faqSchema = new Schema({
    guildId: { type: String, required: true },
    trigger: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

module.exports = model('Faq', faqSchema);