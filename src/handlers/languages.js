
const languageSchema = require('../models/LanguageSchema.js');
const lang = require('../../lang.json');
const mongoose = require("mongoose");


// {'guildId: 'language'}
const guildLanguages = {}
console.log(guildLanguages)

const loadLanguages = async (client) => {
    try{
        for (const guild of client.guilds.cache) {
            const guildId = guild[0];
            //console.log(guild)
            //console.log(guild[0])
            //console.log(guild.id)

            const result = await languageSchema.findOne({
                _id: guildId,
            })


            guildLanguages[guildId] = result ? result.language : 'english'
        }
    } catch (e) {}

}

    const setLanguage = (guild, language) => {
    const safeLanguage = (language ?? 'english').toLowerCase();
    guildLanguages[guild.id] = safeLanguage;
};


module.exports = (guild, textId) => {
    if(!lang.translations[textId]) {
        throw new Error(`Unknown text ID ${textId}`)
    }

    //console.log(guildLanguages[guild.id])
    const selectedLanguage =
    (guildLanguages[guild.id] ?? 'english').toLowerCase();


    return lang.translations[textId][selectedLanguage]
}

module.exports.loadLanguages = loadLanguages
module.exports.setLanguage = setLanguage
