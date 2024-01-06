const {MessageEmbed, Permissions, Client, Interaction} = require('discord.js');



module.exports = {
    name: "bug",
    description: "Bug Report",
    devOnly: true,
    //testOnly: true,
    //options: Object[],
    //deleted: Boolean,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const bug_report_channel = client.channels.cache.get("899379299256250438");

        const msg_no_reason = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                {name: "ERROR", value: ":x: Please specify the bug :x:", inline: false}
            )
            .setTimestamp()

        const bug_reported = new MessageEmbed()
            .setColor("#9fb1fd")
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                {name: "Bug reported: ", value: "Thank you for your bug report. We will make sure that the bug is fixed as soon as possible.", inline: false}
            )
            .setTimestamp()

        const new_bug_report = new MessageEmbed()
            .setColor("#9fb1fd")
            .setTitle("Bugreport auf dem Server " + interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                {name: "GUILD ID:", value: interaction.guild.id, inline: false},
                {name: "USER:", value: interaction.author.username, inline: false},
                {name: "USER ID:", value: interaction.author.id, inline: false},
                {name: "Region:", value: interaction.guild.preferredLocale.toString(), inline: false},
                {name: "Membercount:", value: interaction.guild.memberCount.toString(), inline: false},
                {name: "BUG:", value: interaction.join(" "), inline: false}
            )
            .setTimestamp()

        try {
            if (interaction[0].toString === "") {
                interaction.editReply({embeds: [msg_no_reason]});
            } else {
                interaction.editReply({embeds: [bug_reported]});
            }
        } catch (error) {
            return interaction.editReply({embeds: [msg_no_reason]});
        }



        return bug_report_channel.send({embeds: [new_bug_report]});
    },
};