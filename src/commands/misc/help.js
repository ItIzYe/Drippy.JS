const {
    Client,
    Interaction,
    ButtonInteraction,
    ApplicationCommandOptionType,
    PermissionFlagsBits, Permissions,MessageEmbed
} = require('discord.js');


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {ButtonInteraction} buttonInteraction
     */
    name: 'help',
    description: 'Help Commands',
    options: [],
    callback: async (client, interaction) => {

        const mod = ["Moderation", "moderation", "MODERATION", "MOD", "Mod", "mod"];

        const infos = ['Infos', 'INFOS', 'INFO', 'Info', 'info'];

        const fun = ['Fun', 'FUN', "fun"];

        const level = ['Level', 'LEVEL', "level", 'RANK', 'rank', 'Rank'];



        if (args == null || !args[0]) {
            //language en
            const helpEmbed = new MessageEmbed()

                .setColor("#3497da")
                .setTitle("Help")
                .setDescription("Here you can see the categories into which the help commands are divided." +
                    ` Just do /role [category] to get the roles displayed (categories are separated by hyphens if necessary).` +
                    " If you still have questions, you are welcome to come to our support server. :) https://discord.gg/M8mqCr4vzf")
                //.addField("Kategorien:", "-Moderation(only Teammember) \n-Infos \n-Fun \n-Level", false) // -Member Leave -Member Join Bann/Kick/Mute/Warn
                .setTimestamp();






            const row2 = {
                "type": 1,
                "components": [{
                        "type": 2,
                        "label": "Moderation",
                        "style": 4,
                        "custom_id": "helpMod"
                    },
                    {
                        "type": 2,
                        "label": "Infos",
                        "style": 1,
                        "custom_id": "helpInfos"
                    },
                    {
                        "type": 2,
                        "label": "Fun",
                        "style": 1,
                        "custom_id": "helpFun"
                    },
                    {
                        "type": 2,
                        "label": "Level",
                        "style": 1,
                        "custom_id": "helpLevel"
                    }
                ]
            }


        await interaction.reply({
            embeds: [helpEmbed],
            components: [row2]
        });

        }


        else if (mod.includes(args[0]) && args[0] != null) {
            //language en
            const helpEmbed = new MessageEmbed()

                .setColor("#9b59b5")
                .setTitle("Help - Moderation")
                .setTimestamp()
                .addFields(
                    {name: "⠀", value: "__**Owner**__"},
                    {
                        name: `${prefix}nuke [Channel]`,
                        value: "-> Deletes the specified channel and creates it again",
                        inline: true
                    },
                    {name: "⠀", value: "__**Mod**__"},
                    {
                        name: `${prefix}ban [Member] [Grund]`,
                        value: "-> Bans a member from the server",
                        inline: true
                    },
                    {name: `${prefix}mute [Member] [Reason]`, value: "-> Mutes a member", inline: true},
                    {name: `${prefix}unmute [Member]`, value: "-> Unmutes a member", inline: true},
                    {
                        name: `${prefix}tempmute [Zeit in h] [Member] [Reason]`,
                        value: "-> Mutes a member for a certain period of time",
                        inline: true
                    },
                    {name: `⠀`, value: "__**Supporter**__"},
                    {name: `${prefix}kick [Member] [Reason]`, value: "-> Kicks a Member", inline: true},
                    {name: `${prefix}warn [Member] [Reason]`, value: "-> Warns a Member", inline: true}
                );
            await interaction.reply({embeds: [helpEmbed], ephemeral: true});


        } else if (infos.includes(args[0]) && args[0] != null) {
            //language en
                const helpEmbed = new MessageEmbed()

                    .setColor("#9b59b5")
                    .setTitle("Help - Infos")
                    .setTimestamp()
                    .addFields(
                        {name: `${prefix}info`, value: "-> Shows you some info about the bot"},
                        {name: `${prefix}serverinfo`, value: "-> Shows you some info about the server"},
                        {name: `${prefix}userinfo`, value: "-> Shows you some info about a user"},
                        {name: `${prefix}ping`, value: "-> Shows you the ping"},
                        {
                            name: `${prefix}boost`,
                            value: "-> Shows you the advantages you get when you boost the server."
                        }
                    );
                await interaction.reply({embeds: [helpEmbed]});
        }
        else if (fun.includes(args[0]) && args[0] != null) {
        //language en
            const helpEmbed = new MessageEmbed()

                .setColor("#9b59b5")
                .setTitle("Help - Fun")
                .setTimestamp()
                .addFields(
                    {name: `${prefix}meme`, value: "-> Show you a random meme"},
                    {name: `${prefix}quiz`, value: "-> Play a quiz!"},
                    {name: `${prefix}game`, value: "-> Play a dice game! `(In progress)`"}
                )
            await interaction.reply({embeds: [helpEmbed]});

        }

        else if (level.includes(args[0]) && args[0] != null) {
            //language en
            const helpEmbed = new MessageEmbed()

                .setColor("#9b59b5")
                .setTitle("Help - Leveling")
                .setTimestamp()
                .addFields(
                    {name: `${prefix}level [Member]`, value: "-> Shows you the current level."},
                    {name: `${prefix}rank [Member]`, value: "-> Still under development..."},
                    {name: `${prefix}xp [Member]`, value: "-> Shows you the current XP."},
                    {name: `${prefix}leaderboard`, value: "-> Shows you the current leaderboard of the server."},
                    {
                        name: `${prefix}add-xp [amout] [Member]`,
                        value: "-> Adds XP to a member. (only Mods & Admins)"
                    },
                    {
                        name: `${prefix}remove-xp [amout] [Member]`,
                        value: "-> Removes XP from a member. (only Mods & Admins)"
                    }
                )

            await interaction.reply({embeds: [helpEmbed]});





        }

    }
}