const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');

const Level = require('../../models/Level')
fs = require('fs');
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: "ranking",
    description: "Erstellt Server ranking",
    callback: async (client, interaction) => {

        const levelsArray = await Level.find({guildId: interaction.guild.id})
        const verifiedUser = levelsArray.map((user) => user)

        console.log(verifiedUser[verifiedUser.userId])
         interaction.guild.members.cache.forEach(member => {
            if(levelsArray.includes(member.user.id)){
                console.log(levelsArray)
            }
            // ...
        });
    }
}