const {
    Client,
    Interaction,
    ButtonInteraction,
    ApplicationCommandOptionType,
    PermissionFlagsBits, Permissions,EmbedBuilder
} = require('discord.js');

const mod = ["Moderation", "moderation", "MODERATION", "MOD", "Mod", "mod"];

const infos = ['Infos','infos', 'INFOS', 'INFO', 'Info', 'info'];

const fun = ['Fun', 'FUN', "fun"];

const level = ['Level', 'LEVEL', "level", 'RANK', 'rank', 'Rank'];

const pagination = require('../../handlers/pagination.js')

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: 'help',
    description: 'Help Commands',
    //options: [{name: "section", description: "Please insert a section", required: false, type: 3}],


    callback: async (client, interaction) => {

        const helpEmbed = new EmbedBuilder()

            .setColor("#3497da")
            .setTitle("Help")
            .setDescription("Here you can see the categories into which the help commands are divided." +
                ` Just do /role [category] to get the roles displayed (categories are separated by hyphens if necessary).` +
                " If you still have questions, you are welcome to come to our support server. :) https://discord.gg/M8mqCr4vzf")
            //.addField("Kategorien:", "-Moderation(only Teammember) \n-Infos \n-Fun \n-Level", false) // -Member Leave -Member Join Bann/Kick/Mute/Warn
            .setTimestamp();


        const helpEmbed1 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Moderation")
            .setTimestamp()
            .addFields(
                {name: "⠀", value: "__**Owner**__"},
                {
                    name: `nuke [Channel]`,
                    value: "-> Deletes the specified channel and creates it again",
                    inline: true
                },
                {name: "⠀", value: "__**Mod**__"},
                {
                    name: `ban [Member] [Grund]`,
                    value: "-> Bans a member from the server",
                    inline: true
                },
                {name: `mute [Member] [Reason]`, value: "-> Mutes a member", inline: true},
                {name: `unmute [Member]`, value: "-> Unmutes a member", inline: true},
                {
                    name: `tempmute [Zeit in h] [Member] [Reason]`,
                    value: "-> Mutes a member for a certain period of time",
                    inline: true
                },
                {name: `⠀`, value: "__**Supporter**__"},
                {name: `kick [Member] [Reason]`, value: "-> Kicks a Member", inline: true},
                {name: `warn [Member] [Reason]`, value: "-> Warns a Member", inline: true}
            );

            //language en
        const helpEmbed2 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Infos")
            .setTimestamp()
            .addFields(
                {name: `info`, value: "-> Shows you some info about the bot"},
                {name: `serverinfo`, value: "-> Shows you some info about the server"},
                {name: `userinfo`, value: "-> Shows you some info about a user"},
                {name: `ping`, value: "-> Shows you the ping"},
                {
                    name: `boost`,
                    value: "-> Shows you the advantages you get when you boost the server."
                }
            );

        const helpEmbed3 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Fun")
            .setTimestamp()
            .addFields(
                {name: `meme`, value: "-> Show you a random meme"},
                {name: `quiz`, value: "-> Play a quiz!"},
                {name: `game`, value: "-> Play a dice game! `(In progress)`"}
            );

        const helpEmbed4 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Leveling")
            .setTimestamp()
            .addFields(
                {name: `level [Member]`, value: "-> Shows you the current level."},
                {name: `rank [Member]`, value: "-> Still under development..."},
                {name: `xp [Member]`, value: "-> Shows you the current XP."},
                {name: `leaderboard`, value: "-> Shows you the current leaderboard of the server."},
                {
                    name: `add-xp [amout] [Member]`,
                    value: "-> Adds XP to a member. (only Mods & Admins)"
                },
                {
                    name: `remove-xp [amout] [Member]`,
                    value: "-> Removes XP from a member. (only Mods & Admins)"
                }
            );


        const embeds = [helpEmbed, helpEmbed1, helpEmbed2, helpEmbed3, helpEmbed4];

        await pagination(interaction, embeds);

    }
}