const prefix = '!#';
const {MessageEmbed, Permissions, MessageActionRow, MessageButton, Client, EmbedBuilder} = require('discord.js');
fs = require('fs');


module.exports = {
    name: "permission_error",
    description: "Permission Error Embed wird gesendet",
    callback (client, interaction) {

        const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("ERROR!")
            .setDescription("You don´t have the permissions to do that!")
            .setTimestamp()


        return interaction.reply({embeds: [errorEmbed], ephemeral: true});

    }
};