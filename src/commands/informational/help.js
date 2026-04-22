const {
    Client,
    Interaction,
    ButtonInteraction,
    ApplicationCommandOptionType,
    PermissionFlagsBits, Permissions,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

const pagination = require('../../utils/pagination.js')
const language = require("../../handlers/languages");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: 'help',
    description: 'See a list of all commands',
    //testOnly: true,

    callback: async (client, interaction) => {

        const { guild } = interaction

        /** const embed = new EmbedBuilder()
         .setColor("Blue")
         .setTitle("Help")
         .setDescription("Command Guide:")
         .addFields({name: 'Page 1', value:'Help & Ressources (button1)'})
         .addFields({name: 'Page 2', value:'Moderaction commands (button2)'})
         .addFields({name: 'Page 3', value:'Miscellaneous (button3)'})
         **/


        const helpEmbed = new EmbedBuilder()

            .setColor("#3497da")
            .setTitle(`${language(guild, 'HELP_MAINTITLE')}`)
            .setDescription(`${language(guild, 'HELP_DESCRIPTION')}`)
            //.addField("Kategorien:", "-Moderation(only Teammember) \n-Infos \n-Fun \n-Level", false) // -Member Leave -Member Join Bann/Kick/Mute/Warn
            .setTimestamp();


        const helpEmbed1 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Moderation")
            .setTimestamp()
            .addFields(
                {name: `clear [Amount]`, value: `${language(guild, 'H_CLEAR_DESC')}`, inline: true},
                {name: `ban [Member] [Reason]`, value: `${language(guild, 'H_BAN_DESC')}`, inline: true},
                {name: `timeout [Member] [Reason] [Time]`, value: `${language(guild, 'H_TIMEOUT_DESC')}`, inline: true},
                {name: `kick [Member] [Reason]`, value: `${language(guild, 'H_KICK_DESC')}`, inline: true},
                {name: `lockdown`, value: `${language(guild, 'H_LCKDDWN_DESC')}`, inline: true},
                {name: `slowmode`, value: `${language(guild, 'H_SLWMODE_DESC')}`, inline: true},
                {name: `timeout`, value: `${language(guild, 'H_TIMEOUT_DESC')}`, inline: true},
            );

        //language en
        const helpEmbed2 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Informational")
            .setTimestamp()
            .addFields(
                {name: `info`, value: `${language(guild, 'H_INFO_DESC')}`},
                {name: `serverinfo`, value: `${language(guild, 'H_SERVERINFO_DESC')}`},
                {name: `userinfo`, value: `${language(guild, 'H_USR_DESC')}`},
                {name: `ping`, value: `${language(guild, 'H_PING_DESC')}`},
                {name: `boost`, value: `${language(guild, 'H_BOOST_DESC')}`},
                
            );

        const helpEmbed3 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Suggestions")
            .setTimestamp()
            .addFields(
                {name: `suggest`, value:`${language(guild, 'H_SUGG_DESC')}`},
            );

        const helpEmbed4 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Maintenance")
            .setTimestamp()
            .addFields(
                {name: `config-view`, value: `${language(guild, 'H_CONVIEW_DESC')}`},
                {name: `setup-welcome-message`, value: `${language(guild, 'H_CONLANG_DESC')}`},
                {name: `faq-admin`, value: `${language(guild, 'H_FAQA_DESC')}`},
                {name: `rules`, value: `${language(guild, 'H_RULES_DESC')}`},
                {name: `setup-logs`, value: `${language(guild, 'H_RULES_DESC')}`},
            );

        const helpEmbed5 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Bugs")
            .setTimestamp()
            .addFields(
                {name: `bug [bug-report]`, value: `${language(guild, 'H_BUG_DESC')}`},
            );

        const helpEmbed6 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Level")
            .setTimestamp()
            .addFields(
                {name: `level`, value: `${language(guild, 'H_LVL_DESC')}`},
                {name: `leaderboard`, value: `${language(guild, 'H_LB_DESC')}`},
            );

        const helpEmbed7 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Miscellaneous")
            .setTimestamp()
            .addFields(
                {name: `faq`, value: `${language(guild, 'H_FAQ_DESC')}`},
                {name: `lfg`, value: `${language(guild, 'H_LFG_DESC')}`},
            );

        const helpEmbed8 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Miscellaneous")
            .setTimestamp()
            .addFields(
                {name: `gtn`, value: `${language(guild, 'H_GTN_DESC')}`},
                {name: `quiz`, value: `${language(guild, 'H_QUIZ_DESC')}`},
                {name: `meme`, value: `${language(guild, 'H_MEME_DESC')}`},
            );


        const embeds = [helpEmbed, helpEmbed1, helpEmbed2, helpEmbed3, helpEmbed4, helpEmbed5, helpEmbed6, helpEmbed7, helpEmbed8]

        await pagination(interaction, embeds);

    }
}