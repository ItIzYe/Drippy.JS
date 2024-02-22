const {EmbedBuilder, Client, Interaction} = require('discord.js');
const language = require("../../handlers/languages");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "info",
    description: "Get Infos about Drippy",


    callback: async (client, interaction) => {

        const { guild } = interaction

        const infoEmbed = new EmbedBuilder()
            .setColor("#1f8a4c")
            .setTitle("Info")
            .setDescription("Hier ein paar Bot-Infos")
            .addFields(
                {name: "Name", value: "Drippy#5683", inline: false},
                {name: `${language(guild, 'INFO_FIELD2')}`, value: "Count: " + client.guilds.cache.size, inline: false},
                {name: "Developer: ", value: "itizye,\nr.m.stitanic,\ncanadianagent", inline: false},
                {name: "Version: ", value: "1.0.9 Beta", inline: false},
                {name: `${language(guild, 'INFO_FIELD5')}`, value: "22.02.2024", inline: false},
                {name: `${language(guild, 'INFO_FIELD6')}`, value: `${language(guild, 'INFO_FIELD6_VALUE')}`, inline: false}
            )
            .setTimestamp()



        await interaction.reply({embeds: [infoEmbed]});


    }
}


