const prefix = '!#';
const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Client, Embed, ActionRowBuilder} = require('discord.js');


module.exports = {
    name: 'help',
    //data: new SlashCommandBuilder()
        //.setName('help')
    description:'Help Commands',
    callback(client, interaction, args) {

        const mod = ["Moderation", "moderation", "MODERATION", "MOD", "Mod", "mod"];

        const infos = ['Infos', 'INFOS', 'INFO', 'Info', 'info'];

        const fun = ['Fun', 'FUN', "fun"];

        const level = ['Level', 'LEVEL', "level", 'RANK', 'rank', 'Rank'];



        if (args == null || !args[0]) {
            //language en
            const helpEmbed = new EmbedBuilder()

                .setColor("#3497da")
                .setTitle("Help")
                .setDescription("Here you can see the categories into which the help commands are divided." +
                    ` Just do ${prefix}role [category] to get the roles displayed (categories are separated by hyphens if necessary).` +
                    " If you still have questions, you are welcome to come to our support server. :) https://discord.gg/M8mqCr4vzf")
                .addFields({name:"Kategorien:", value:"-Moderation(only Teammember) \n-Infos \n-Fun \n-Level", inline:false}) // -Member Leave -Member Join Bann/Kick/Mute/Warn
                .setTimestamp();



            const modButton = new ButtonBuilder()
            .setCustomId('helpMod')
            .setLabel('Moderation')
            .setStyle(ButtonStyle.Danger)

            const infosButton = new ButtonBuilder()
            .setCustomId('helpInfos')
            .setLabel('Infos')
            .setStyle(ButtonStyle.Secondary)

            const funButton = new ButtonBuilder()
            .setCustomId('helpFun')
            .setLabel('Fun')
            .setStyle(ButtonStyle.Secondary)
            

            const levelButton = new ButtonBuilder()
            .setCustomId('helpLevel')
            .setLabel('Level')
            .setStyle(ButtonStyle.Secondary)



    


            const row2 = new ActionRowBuilder()
            .addComponents(modButton, infosButton, funButton, levelButton)


            interaction.reply({
                embeds: [helpEmbed],
                components: [row2]
            });

        }


        else if (mod.includes(args[0]) && args[0] != null) {
            //language en
            const helpEmbed = new EmbedBuilder()

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
            interaction.reply({embeds: [helpEmbed], ephemeral: true});


        } else if (infos.includes(args[0]) && args[0] != null) {
            //language en
            const helpEmbed = new EmbedBuilder()

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
            interaction.reply({embeds: [helpEmbed]});
        }
        else if (fun.includes(args[0]) && args[0] != null) {
            //language en
            const helpEmbed = new EmbedBuilder()

                .setColor("#9b59b5")
                .setTitle("Help - Fun")
                .setTimestamp()
                .addFields(
                    {name: `${prefix}meme`, value: "-> Show you a random meme"},
                    {name: `${prefix}quiz`, value: "-> Play a quiz!"},
                    {name: `${prefix}game`, value: "-> Play a dice game! `(In progress)`"}
                )
            interaction.reply({embeds: [helpEmbed]});

        }

        else if (level.includes(args[0]) && args[0] != null) {
            //language en
            const helpEmbed = new EmbedBuilder()

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

            interaction.reply({embeds: [helpEmbed]});


            }


        }

    }
