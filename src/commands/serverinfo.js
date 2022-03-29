const prefix = '!#';
const {MessageEmbed, Permissions, Client} = require('discord.js');


module.exports = {
    name: "sv",
    description: "Get Serverinfos",
    async execute(client, message, args) {
        //console.log(message.guild);

        const owner = client.users.cache.find(user => user.id === message.guild.ownerId);


        const svinfoEmbed = new MessageEmbed()
            .setColor("#00fdfe")
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .addFields(
                {name: "Owner: ", value: owner.username + "#" + owner.discriminator, inline: false},
                {name: "Region: ", value: message.guild.preferredLocale.toString(), inline: false},
                {name: "Membercount: ", value: message.guild.memberCount.toString(), inline: false}
            )
            .setTimestamp()
            //.setFooter(`GUILD ID: ${message.guild.id}`, message.guild.iconURL())

        await message.reply({embeds: [svinfoEmbed]});
    }

}
