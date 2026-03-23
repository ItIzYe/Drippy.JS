const {ActivityType} = require('discord.js');
const {loadLanguages} = require('../../handlers/languages')

module.exports = (client) => {

    loadLanguages(client);
    console.log(`✅ ${client.user.tag} is online`)

    client.user.setActivity({
        name:'☾ .* · ✵ ˚',
        type: 3,
        }
    )
};