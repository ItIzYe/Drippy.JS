const {Schema, model} = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const languageSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    }
});

module.exports = model('languages', languageSchema)