const {EmbedBuilder, Permissions, Client, Interaction} = require('discord.js');


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

        const serverOwner = await interaction.guild.fetchOwner()


        const svinfoEmbed = new EmbedBuilder()
            .setColor("#00fdfe")
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                {name: "Owner: ", value: serverOwner.displayName, inline: false},
                {name: "Region: ", value: interaction.guild.preferredLocale.toString(), inline: false},
                {name: "Membercount: ", value: interaction.guild.memberCount.toString(), inline: false}
            )
            .setTimestamp()


        await interaction.reply({embeds: [svinfoEmbed]});
    }

}
