const { MessageActionRow, MessageButton, MessageEmbed, Permissions} = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "bug",
    description: "Bug Report",
    async execute (client, message, args) {
        const channel2 = client.channels.cache.get("899379299256250438");
        try {
            if (args[0].toString === "") {
                return message.reply(":x: Please specify the bug :x:");
            } else {
                await message.reply("Thank you for your bug report. We will make sure that the bug is fixed as soon as possible.");
            }
        } catch (error) {
            return message.reply(":x: Please specify the bug :x:");
        }

        return channel2.send(`Es gab einen Bugreport von ${message.author.username}#${message.author.discriminator} (id = ${message.author.id}) auf dem ${message.member.guild.name} Server (id = ${message.member.guild.id}). Bug: ${args.join(" ")}`);
    }
}