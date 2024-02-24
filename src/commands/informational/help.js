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
    deleted: true,

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
            );

        //language en
        const helpEmbed2 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Informational")
            .setTimestamp()
            .addFields(
                {name: `info`, value: `${language(guild, 'H_INFO_DESC')}`},
                {name: `serverinfo`, value: `${language(guild, 'H_SERVERINFO_DESC')}`},
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
            {name: `config-suggestions`, value: `${language(guild, 'H_CONSUGG_DESC')}`},
                {name: `config-announcement`, value: `${language(guild, 'H_CONANN_DESC')}`},
                {name: `config-moderation`, value: `${language(guild, 'H_CONMOD_DESC')}`},
                {name: `set-lang`, value: `${language(guild, 'H_CONLANG_DESC')}`},
            );

        const helpEmbed5 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Bugs")
            .setTimestamp()
            .addFields(
                {name: `bug [bug-report]`, value: `${language(guild, 'H_BUG_DESC')}`},
            );

        const embeds = [helpEmbed, helpEmbed1, helpEmbed2, helpEmbed3, helpEmbed4, helpEmbed5]

        await pagination(interaction, embeds);

    }
}