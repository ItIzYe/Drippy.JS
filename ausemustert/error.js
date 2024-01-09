const prefix = '!#';
const {MessageEmbed, Permissions, MessageActionRow, MessageButton, Client} = require('discord.js');
fs = require('fs');


module.exports = {
    name: "permission_error",
    description: "Permission Error Embed wird gesendet",
    async execute (client, message) {

        const errorEmbed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("ERROR!")
            .setDescription("You don´t have the permissions to do that!")
            .setTimestamp()


        return message.reply({embeds: [errorEmbed], ephemeral: true});

    }
};