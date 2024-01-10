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

        await interaction.guild.members.cache.forEach(member => {
            //Öffnet die JSON Datei
            let memberXp =  Level.findOne({userID: member.user.id});
            const finMemberXp = memberXp?.query.userID;
            console.log(finMemberXp)
        });
    }
}