const { MessageActionRow, MessageButton, MessageEmbed, Permissions} = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "bug",
    description: "Bug Report",
    callback (client, interaction, args) {
        const channel2 = client.channels.cache.get("899379299256250438");
        try {
            if (args[0].toString === "") {
                interaction.reply(":x: Please specify the bug :x:");
            } else {
                interaction.reply("Thank you for your bug report. We will make sure that the bug is fixed as soon as possible.");
            }
        } catch (error) {
            interaction.reply(":x: Please specify the bug :x:");
        }

        return channel2.send(`Es gab einen Bugreport von ${interaction.author.username}#${interaction.author.discriminator} (id = ${interaction.author.id}) auf dem ${interaction.member.guild.name} Server (id = ${interaction.member.guild.id}). Bug: ${args.join(" ")}`);
    }
}