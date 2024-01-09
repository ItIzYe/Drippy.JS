const {EmbedBuilder, Permissions, Client, Interaction, MessageManager} = require('discord.js');
const mongoose = require('mongoose');
const BugConfig = require('../../models/BugConfig.js');
const GuildConfiguration = require("../../models/GuildConfiguration");


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: "bug-config",
    description: "Bug Report",
    devOnly: true,
    testOnly: true,
    options: [{
        name: "set-bug",
        description: "Please set the importance of the bug",
        type: 3,
        required: true
    }, {
        name: "set-status",
        description: "Please set the status of the bug",
        type: 3,
        choices: [{name:'pending',description:'Set status', value:'[PENDING]'}, {name:'in-progress',description:'Set status', value: '[IN PROGRESS]'},{name:'finished', description:'Set status',value: '[FINISHED]'}],
        required: true
    }, {
        name: "set-importance",
        description: "Please set the importance of the bug",
        choices: [{name:'not-important',description:'Set status', value:'Not important'}, {name:'important',description:'Set status', value: 'Important'},{name:'very-important',description:'Set status', value: 'Very important'}],
        type: 3,
        required: true
    }],
    //deleted: Boolean,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const new_status = interaction.options.get('set-status').value
        const new_importance = interaction.options.get('set-importance').value
        const getBugID = interaction.options.get('set-bug').value
        const bugconfig = await BugConfig.findOne({bugID: getBugID})
        const bug_report_channel = client.channels.cache.get("899379299256250438");

        try {

            if (interaction.options.get('set-status') && !interaction.options.get('set-importance')) {
                const new_status = interaction.options.get('set-status').value
                const newCustomId = BugConfig.updateMany({status: new_status, importance: "pending"});
            }
            if (!interaction.options.get('set-status') && interaction.options.get('set-importance')) {
                const new_importance = interaction.options.get('set-importance').value
                const newImportance = BugConfig.updateMany({status: "pending", importance: new_importance});
            }
            if (interaction.options.get('set-status') && interaction.options.get('set-importance')) {
                const new_status = interaction.options.get('set-status').value
                const new_importance = interaction.options.get('set-importance').value
                const newCustomId = BugConfig.updateMany({status: new_status, importance: new_importance})
            }


            if (new_status === '[PENDING]') {
                if (new_importance === 'Not important') {
                    const new_bug_report1 = new EmbedBuilder()
                        .setColor("#20773f")
                        .setTitle("Bugreport auf dem Server " + interaction.guild.name)
                        .setThumbnail(interaction.guild.iconURL())
                        .setFields(
                            {name: "IMPORTANCE:", value: `${new_importance}`, inline: false},
                            {name: "GUILD ID:", value: `${bugconfig.guildID}`, inline: true},
                            {name: "Region:", value: `${bugconfig.region}`, inline: true},
                            {name: "Membercount:", value: `${bugconfig.memberCount}`, inline: false},
                            {name: "USER:", value: `${bugconfig.userTag}`, inline: true},
                            {name: "USER ID:", value: `${bugconfig.userID}`, inline: true},
                            {name: "BUG:", value: `${bugconfig.bug}`, inline: false},
                            {name: "BUG ID:", value: `${bugconfig.bugID}`, inline: true})
                        .setTimestamp()
                    bug_report_channel.messages.fetch(getBugID).then(message => message.edit({embeds: [new_bug_report1]}))

                } else if (new_importance === 'Important') {
                    const new_bug_report1 = new EmbedBuilder()
                        .setColor("#fcbe35")
                        .setTitle("Bugreport auf dem Server " + interaction.guild.name)
                        .setThumbnail(interaction.guild.iconURL())
                        .setFields(
                            {name: "IMPORTANCE:", value: `${new_importance}`},
                            {name: "GUILD ID:", value: `${bugconfig.guildID}`, inline: true},
                            {name: "Region:", value: `${bugconfig.region}`, inline: true},
                            {name: "Membercount:", value: `${bugconfig.memberCount}`, inline: false},
                            {name: "USER:", value: `${bugconfig.userTag}`, inline: true},
                            {name: "USER ID:", value: `${bugconfig.userID}`, inline: true},
                            {name: "BUG:", value: `${bugconfig.bug}`, inline: false},
                            {name: "BUG ID:", value: `${bugconfig.bugID}`, inline: true})
                        .setTimestamp()
                    bug_report_channel.messages.fetch(getBugID).then(message => message.edit({embeds: [new_bug_report1]}))

                } else if (new_importance === 'Very important') {
                    const new_bug_report1 = new EmbedBuilder()
                        .setColor("#71112a")
                        .setTitle("Bugreport auf dem Server " + interaction.guild.name)
                        .setThumbnail(interaction.guild.iconURL())
                        .setFields(
                            {name: "IMPORTANCE:", value: `${new_importance}`},
                            {name: "GUILD ID:", value: `${bugconfig.guildID}`, inline: true},
                            {name: "Region:", value: `${bugconfig.region}`, inline: true},
                            {name: "Membercount:", value: `${bugconfig.memberCount}`, inline: false},
                            {name: "USER:", value: `${bugconfig.userTag}`, inline: true},
                            {name: "USER ID:", value: `${bugconfig.userID}`, inline: true},
                            {name: "BUG:", value: `${bugconfig.bug}`, inline: false},
                            {name: "BUG ID:", value: `${bugconfig.bugID}`, inline: true})
                        .setTimestamp()
                    bug_report_channel.messages.fetch(getBugID).then(message => message.edit({embeds: [new_bug_report1]}))
                }


            } else if (new_status === '[IN PROGRESS]') {
                const new_bug_report1 = new EmbedBuilder()
                    .setColor("#FEEAA5")
                    .setTitle("Bugreport auf dem Server " + interaction.guild.name)
                    .setThumbnail(interaction.guild.iconURL())
                    .setFields(
                        {name: "IMPORTANCE:", value: `${new_importance}`, inline: false},
                        {name: "GUILD ID:", value: `${bugconfig.guildID}`, inline: true},
                        {name: "Region:", value: `${bugconfig.region}`, inline: true},
                        {name: "Membercount:", value: `${bugconfig.memberCount}`, inline: false},
                        {name: "USER:", value: `${bugconfig.userTag}`, inline: true},
                        {name: "USER ID:", value: `${bugconfig.userID}`, inline: true},
                        {name: "BUG:", value: `${bugconfig.bug}`, inline: false},
                        {name: "BUG ID:", value: `${bugconfig.bugID}`, inline: true})
                    .setTimestamp()
                bug_report_channel.messages.fetch(getBugID).then(message => message.edit({embeds: [new_bug_report1]}))

            } else if (new_status === '[FINISHED]') {
                const new_bug_report1 = new EmbedBuilder()
                    .setColor("#a5f0c5")
                    .setTitle("Bugreport auf dem Server " + interaction.guild.name)
                    .setThumbnail(interaction.guild.iconURL())
                    .setFields(
                        {name: "IMPORTANCE:", value: `${new_importance}`, inline: false},
                        {name: "GUILD ID:", value: `${bugconfig.guildID}`, inline: true},
                        {name: "Region:", value: `${bugconfig.region}`, inline: true},
                        {name: "Membercount:", value: `${bugconfig.memberCount}`, inline: false},
                        {name: "USER:", value: `${bugconfig.userTag}`, inline: true},
                        {name: "USER ID:", value: `${bugconfig.userID}`, inline: true},
                        {name: "BUG:", value: `${bugconfig.bug}`, inline: false},
                        {name: "BUG ID:", value: `${bugconfig.bugID}`, inline: true})
                    .setTimestamp()
                bug_report_channel.messages.fetch(getBugID).then(message => message.edit({embeds: [new_bug_report1]}))


            }
            const embed = new EmbedBuilder()
                .setTitle("Bugreport wurd geändert")

            await interaction.editReply({embeds: [embed]})

        } catch (error){
            const embed = new EmbedBuilder()
                .setTitle(`${error}`)
        }
    }


};