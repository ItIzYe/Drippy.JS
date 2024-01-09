const {Schema, model} = require('mongoose');

const imageConfigurationSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    moderationImages: {
        type: [String],
        default: []
    },
    moderationKickImages: {
        type: [String],
        default: []
    }
});

module.exports = model('ImageConfiguration', imageConfigurationSchema)