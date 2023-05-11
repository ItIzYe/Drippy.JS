const prefix = '!#';
const {Permissions, Client, EmbedBuilder} = require('discord.js');


module.exports = {
    name: "sv",
    description: "Get Serverinfos",
    callback(client, interaction) {
        //console.log(message.guild);

        const owner = interaction.guild.fetchOwner();


        const svinfoEmbed = new EmbedBuilder()
            .setColor("#00fdfe")
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                {name: "Owner: ", value: owner, inline: false},
                {name: "Region: ", value: interaction.guild.preferredLocale.toString(), inline: false},
                {name: "Membercount: ", value: interaction.guild.memberCount.toString(), inline: false}
            )
            .setTimestamp()
            //.setFooter(`GUILD ID: ${message.guild.id}`, message.guild.iconURL())

        interaction.reply({embeds: [svinfoEmbed]});
    }

}
