const {
    Client,
    Interaction,
    ButtonInteraction,
    ApplicationCommandOptionType,
    PermissionFlagsBits, Permissions,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

const pagination = require('../../handlers/pagination.js')
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
    //options: [{name: "section", description: "Please insert a section", required: false, type: 3}],


    callback: async (client, interaction) => {


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
                {
                    name: `clear [Amount]`,
                    value: "-> Deletes a specified number of messages in a channel",
                    inline: true
                },
                {
                    name: `ban [Member] [Reason]`,
                    value: "-> Bans a member from the server",
                    inline: true
                },
                {name: `timeout [Member] [Reason] [Time]`, value: "-> Timeouts a member", inline: true},
                {name: `kick [Member] [Reason]`, value: "-> Kicks a Member", inline: true},
            );

            //language en
        const helpEmbed2 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Infos")
            .setTimestamp()
            .addFields(
                {name: `info`, value: "-> Shows you some info about the bot"},
                {name: `serverinfo`, value: "-> Shows you some info about the server"},
                {name: `ping`, value: "-> Shows you the ping"},
                {
                    name: `boost`,
                    value: "-> Shows you the advantages you get when you boost the server."
                },
                {name: "bug", value: "-> Report a Bug to the Bot Team"}
            );

        const helpEmbed3 = new EmbedBuilder()

            .setColor("#9b59b5")
            .setTitle("Help - Suggestions")
            .setTimestamp()
            .addFields(
                {name: `config-suggestions`, value: "-> Add/Remove a channel where the suggestions should go to"},
                {name: `suggest`, value: "-> Suggest things which the Server than can vote about"},
            );


       const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pagefirst')
                    .setEmoji('⏪')
                    .setStyle(ButtonStyle.PRIMARY)
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('pageprev')
                    .setEmoji('◀️')
                    .setStyle(ButtonStyle.PRIMARY)
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('pagecount')
                    .setLabel(`${index + 1}/${pages.length}`)
                    .setStyle(ButtonStyle.SECONDARY)
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('pagenext')
                    .setEmoji('▶️')
                    .setStyle(ButtonStyle.PRIMARY),

                new ButtonBuilder()
                    .setCustomId('pagelast')
                    .setEmoji('⏩')
                    .setStyle(ButtonStyle.PRIMARY),
            )


        const message = await interaction.reply({embeds: [helpEmbed], components: [button]})
        const collector = await message.createMessageComponentCollector();

       collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return await i.reply({content: `Only **${interaction.user.username}** can use these buttons!`, ephemeral: true});

            await i.deferUpdate();

            if (i.customId === 'pagefirst') {
                index = 0;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }
            if (i.customId === 'pageprev') {
                if(index > 0) index--;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }
            else if ( i.customId === 'pagenext'){
                if (index < pages.length - 1){
                    index++;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                }
            }
            else if ( i.customId === 'pagelast'){
                index = pages.length -1;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }

            if (index === 0){
                first.setDisabled(true);
                prev.setDisabled(true);
            }
            else{
                first.setDisabled(false);
                prev.setDisabled(false);
            }

            if (index === pages.length - 1){
                next.setDisabled(true)
                last.setDisabled(true)
            }
            else{
                next.setDisabled(false);
                last.setDisabled(false);
            }

            await msg.edit({embeds: [pages[index]], components:[buttons]}).catch(err => {});

            collector.resetTimer();
       });

       collector.on('end', async () =>{
            await msg.edit({embeds: [pages[index]], components: []}).catch(err => {})
       });


        //const embeds = [helpEmbed, helpEmbed1, helpEmbed2, helpEmbed3, helpEmbed4];

        //pagination(interaction, embeds);

    }
}