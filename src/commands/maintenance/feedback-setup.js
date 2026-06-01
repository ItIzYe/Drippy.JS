const { 
    EmbedBuilder, 
    Client, 
    Interaction, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder,
    PermissionFlagsBits,
    MessageFlags 
} = require('discord.js');
//const language = require("../../handlers/languages");

module.exports = {
    name: "feedback-setup",
    description: "Sendet das permanente Feedback-Embed in diesen Kanal",
    // testOnly: false, // Nicht auf dem Testserver

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const { guild, channel } = interaction;

        //const TARGET_GUILD_ID = "DEINE_LIVE_SERVER_ID"; 

        /**if (guild.id !== TARGET_GUILD_ID) {
            return await interaction.reply({ 
                content: "Dieser Command kann auf diesem Server nicht genutzt werden.", 
                ephemeral: true 
            });
        }**/

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({ 
                content: "Dazu hast du keine Rechte.", 
                ephemeral: true 
            });
        }

        const embedTitle = "Feedback & Bewertung";
        const embedDesc = "Bitte wähle im unteren Dropdown-Menü aus, an wen sich dein Feedback richtet.";

        const setupEmbed = new EmbedBuilder()
            .setColor("#1f8a4c")
            .setTitle(embedTitle)
            .setDescription(embedDesc)
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('feedback_target_select')
            .setPlaceholder('Wähle eine Gruppe aus...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Stream-Moderatoren')
                    .setValue('streammods')
                    .setDescription('Feedback für das Stream-Team')
                    .setEmoji('📺'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Discord-Moderatoren')
                    .setValue('discordmods')
                    .setDescription('Feedback für das Discord-Team')
                    .setEmoji('🛡️')
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ content: "Setup wird ausgeführt...", Flags: MessageFlags.Ephemeral });

        await channel.send({ embeds: [setupEmbed], components: [row] });
    }
}