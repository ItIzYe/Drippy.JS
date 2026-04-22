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
                {name: `clear`, value: `${language(guild, 'H_CLEAR_DESC')}`, inline: true},
                {name: `ban`, value: `${language(guild, 'H_BAN_DESC')}`, inline: true},
                {name: `timeout`, value: `${language(guild, 'H_TIMEOUT_DESC')}`, inline: true},
                {name: `kick`, value: `${language(guild, 'H_KICK_DESC')}`, inline: true},
                {name: `lockdown`, value: `${language(guild, 'H_LCKDWN_DESC')}`, inline: true},
                {name: `slowmode`, value: `${language(guild, 'H_SLWMODE_DESC')}`, inline: true},
            );

        //language en
        const helpEmbed2 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Informational")
            .setTimestamp()
            .addFields(
                {name: `info`, value: `${language(guild, 'H_INFO_DESC')}`, inline: true},
                {name: `serverinfo`, value: `${language(guild, 'H_SERVERINFO_DESC')}`, inline: true},
                {name: `userinfo`, value: `${language(guild, 'H_USR_DESC')}`, inline: true},
                {name: `ping`, value: `${language(guild, 'H_PING_DESC')}`, inline: true},
                {name: `boost`, value: `${language(guild, 'H_BOOST_DESC')}`, inline: true},
                
            );

        const helpEmbed3 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Suggestions")
            .setTimestamp()
            .addFields(
                {name: `suggest`, value:`${language(guild, 'H_SUGG_DESC')}`, inline: true},
            );

        const helpEmbed4 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Maintenance")
            .setTimestamp()
            .addFields(
                {name: `config-view`, value: `${language(guild, 'H_CONVIEW_DESC')}`, inline: true},
                {name: `setup-welcome-message`, value: `${language(guild, 'H_CONLANG_DESC')}`, inline: true},
                {name: `faq-admin`, value: `${language(guild, 'H_FAQA_DESC')}`, inline: true},
                {name: `rules`, value: `${language(guild, 'H_RULES_DESC')}`, inline: true},
                {name: `setup-logs`, value: `${language(guild, 'H_RULES_DESC')}`, inline: true},
            );

        const helpEmbed5 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Bugs")
            .setTimestamp()
            .addFields(
                {name: `bug`, value: `${language(guild, 'H_BUG_DESC')}`, inline: true},
            );

        const helpEmbed6 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Level")
            .setTimestamp()
            .addFields(
                {name: `level`, value: `${language(guild, 'H_LVL_DESC')}`, inline: true},
                {name: `leaderboard`, value: `${language(guild, 'H_LB_DESC')}`, inline: true},
            );

        const helpEmbed7 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Miscellaneous")
            .setTimestamp()
            .addFields(
                {name: `faq`, value: `${language(guild, 'H_FAQ_DESC')}`, inline: true},
                {name: `lfg`, value: `${language(guild, 'H_LFG_DESC')}`, inline: true},
            );

        const helpEmbed8 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Miscellaneous")
            .setTimestamp()
            .addFields(
                {name: `gtn`, value: `${language(guild, 'H_GTN_DESC')}`, inline: true},
                {name: `quiz`, value: `${language(guild, 'H_QUIZ_DESC')}`, inline: true},
                {name: `meme`, value: `${language(guild, 'H_MEME_DESC')}`, inline: true},
            );


        const embeds = [helpEmbed, helpEmbed1, helpEmbed2, helpEmbed3, helpEmbed4, helpEmbed5, helpEmbed6, helpEmbed7, helpEmbed8]

        await pagination(interaction, embeds);

    }
}