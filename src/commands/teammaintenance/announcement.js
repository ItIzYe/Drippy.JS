const { 
    Client, 
    Interaction, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder, 
    PermissionFlagsBits 
} = require('discord.js');

module.exports = {
    name: 'announcement',
    description: 'Öffnet ein Fenster für eine Bot-Ankündigung',
    devOnly: true,

    callback: async (client, interaction) => {
        // Modal erstellen
        const modal = new ModalBuilder()
            .setCustomId(`announcement_modal_${interaction.user.id}`)
            .setTitle('Neue Bot-Ankündigung');

        // Eingabefeld für den Titel/Typ
        const typeInput = new TextInputBuilder()
            .setCustomId('announcement_type')
            .setLabel("Was für eine Art von Ankündigung?")
            .setPlaceholder("z.B. Wartungsarbeiten, Update, Info...")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        // Eingabefeld für die Nachricht
        const messageInput = new TextInputBuilder()
            .setCustomId('announcement_message')
            .setLabel("Deine Nachricht")
            .setPlaceholder("Schreibe hier den Inhalt der Ankündigung...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        // Zeilen zum Modal hinzufügen
        const firstActionRow = new ActionRowBuilder().addComponents(typeInput);
        const secondActionRow = new ActionRowBuilder().addComponents(messageInput);

        modal.addComponents(firstActionRow, secondActionRow);

        // Modal anzeigen
        await interaction.showModal(modal);
    },
};
