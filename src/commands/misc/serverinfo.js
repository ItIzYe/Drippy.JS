const prefix = '!#';
const {MessageEmbed, Permissions, Client, Interaction} = require('discord.js');


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "sv",
    description: "Get Serverinfos",
    callback: async (client, interaction) => {
        //console.log(message.guild);

        const owner = client.users.cache.find(user => user.id === interaction.guild.ownerId);


        const svinfoEmbed = new MessageEmbed()
            .setColor("#00fdfe")
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                {name: "Owner: ", value: owner.username + "#" + owner.discriminator, inline: false},
                {name: "Region: ", value: interaction.guild.preferredLocale.toString(), inline: false},
                {name: "Membercount: ", value: interaction.guild.memberCount.toString(), inline: false}
            )
            .setTimestamp()
            //.setFooter(`GUILD ID: ${message.guild.id}`, message.guild.iconURL())

        await interaction.reply({embeds: [svinfoEmbed]});
    }

}
