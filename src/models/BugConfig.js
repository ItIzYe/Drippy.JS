const {Schema, model} = require('mongoose');

const BugConfigSchema = new Schema({
    guildID: {
    type: String,
    default: "pending"
    },
    userTag: {
        type: String,
        //"pending", "approved","denied"
        default: "pending"
    },
    userID: {
        type: String,
        //"pending", "approved","denied"
        default: "pending"
    },
    region: {
        type: String,
        //"pending", "approved","denied"
        default: "pending"
    },
    memberCount: {
        type: String,
        //"pending", "approved","denied"
        default: "pending"
    },
    bug: {
        type: String,
        //"pending", "approved","denied"
        default: "pending"
    },
    bugID: {
        type: String,
        //"pending", "approved","denied"
        default: "pending"
    },
    status: {
    type: String,
    //"pending", "approved","denied"
    default: "pending"
    },
    importance: {
        type: String,
        //"Not important", "Important","Very important"
        default: "Not important"
    }
});

module.exports = model('BugConfig', BugConfigSchema)