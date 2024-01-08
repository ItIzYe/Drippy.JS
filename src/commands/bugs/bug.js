const {MessageEmbed, Permissions, Client, Interaction} = require('discord.js');
const mongoose = require('mongoose');
const BugConfig = require('../../models/BugConfig');
const GuildConfiguration = require("../../models/GuildConfiguration");


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: "bug",
    description: "Bug Report",
    devOnly: true,
    //testOnly: true,
    options: [{
        name: "bug-report",
        description: "Please specify your bug",
        type: 3,
        required: true
    }],
    //deleted: Boolean,

    callback: async (client, interaction) => {
        await interaction.deferReply();


        const guildId = interaction.guildId;
        const userTag = interaction.user.tag;
        const userId = interaction.user.id;
        const region =  interaction.guildLocale;
        const memberCount = interaction.guild.memberCount;
        const bugReport = interaction.options.get('bug-report').value;
        const messageId = interaction.id

        const bug_report_channel = client.channels.cache.get("899379299256250438");

        const msg_no_reason = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .setFields(
                {name: "ERROR", value: ":x: Please specify the bug :x:", inline: false}
            )
            .setTimestamp()

        const bug_reported = new MessageEmbed()
            .setColor("#9fb1fd")
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .setFields(
                {name: "Bug reported: ", value: "Thank you for your bug report. We will make sure that the bug is fixed as soon as possible.", inline: false}
            )
            .setTimestamp()

        const newBugContent = new BugConfig({
            guildID: guildId,
            userTag: userTag,
            userID: userId,
            region: region,
            memberCount: memberCount,
            bug: bugReport,
            bugID: messageId
        })
        await BugConfig.updateMany();

        const new_bug_report = new MessageEmbed()
            .setColor("#9fb1fd")
            .setTitle("Bugreport auf dem Server " + interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .setFields(
                {name: "GUILD ID:", value: `${newBugContent.guildID}`, inline: false},
                {name: "USER:", value:`${newBugContent.userTag}`, inline: false},
                {name: "USER ID:", value: `${newBugContent.userID}`, inline: false},
                {name: "Region:", value:`${newBugContent.region}`, inline: false},
                {name: "Membercount:",value: `${newBugContent.memberCount}`, inline: false},
                {name: "BUG:", value:`${newBugContent.bug}`, inline: false},
                {name: "BUG ID:", value:`${newBugContent.bugID}`, inline: false})
            .setTimestamp()

        const row2 = {
            "type": 1,
            "components": [{
                "type": 2,
                "label": "sent by Drippy",
                "style": 1,
                "custom_id": "bugDrippy",
                "disabled": true,
            }]
        }


        try {
            if (bugReport.toString === "") {
                interaction.editReply({embeds: [msg_no_reason]});
            } else {
                interaction.editReply({embeds: [bug_reported]});
            }
        } catch (error) {
            return interaction.editReply({embeds: [msg_no_reason]});
        }



        return bug_report_channel.send({embeds: [new_bug_report], components: [row2]});
    },
};