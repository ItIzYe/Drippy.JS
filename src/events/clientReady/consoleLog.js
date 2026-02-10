const {ActivityType} = require('discord.js');
const {loadLanguages} = require('../../handlers/languages')

module.exports = (client) => {

    loadLanguages(client);
    console.log(`✅ ${client.user.tag} is online`)

    client.user.setActivity({
        name:'Die Katze im Backofen',
        type: 3,
        }
    )
};