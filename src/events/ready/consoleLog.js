const {ActivityType} = require('discord.js');

module.exports = (client) => {
    console.log(`✅ ${client.user.tag} is online`)

    client.user.setActivity({
        name:'Die Katze im Backofen',
        type: 3,
        }
    )
};