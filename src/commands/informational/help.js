const { 
    Client, 
    Interaction, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

const language = require("../../handlers/languages");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: 'help',
    description: 'See a list of all commands',
    //testOnly: true,

    callback: async (client, interaction) => {
        const { guild } = interaction;

        // 1. Das neue, cleane Start-Embed (nutzt deine originalen Language-Keys)
        const helpEmbed = new EmbedBuilder()
            .setColor("#1f8a4c") // Dein Drippy-Grün für ein einheitliches Design
            .setTitle(`${language(guild, 'HELP_MAINTITLE') || 'Drippy — Hilfe & Befehle'}`)
            .setDescription(
                `${language(guild, 'HELP_DESCRIPTION') || 'Hier findest du Hilfe zu Drippy!'}\n\n` +
                `💡 ${language(guild, 'H_F_1')}`
            )
            .addFields(
                { 
                    name: `🌐 ${language(guild, 'H_F_2_T')}`, 
                    value: `${language(guild, 'H_F_2')}`, 
                    inline: false 
                }
            )
            .setTimestamp()
            .setFooter({ text: `${client.user.username} Help System`, iconURL: client.user.displayAvatarURL() });

        // 2. Der Link-Button, der direkt auf deine funktionierende GitHub Pages URL verweist
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel(`🌐 ${language(guild, 'H_F_2_B')}`)
                .setURL('https://itizye.github.io/Drippy.JS/') // Deine verifizierte GitHub-Pages URL
                .setStyle(ButtonStyle.Link)
        );

        // 3. Antwort an die Discord-Interaction senden
        await interaction.reply({ embeds: [helpEmbed], components: [row] });
    }
}