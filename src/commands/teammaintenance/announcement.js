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
    description: 'Öffnet ein Fenster für eine globale Bot-Ankündigung',
    devOnly: true, // Nur für dich als Developer
    testOnly: true,
    //deleted: true,

    callback: async (client, interaction) => {
        const modal = new ModalBuilder()
            .setCustomId(`announcement_modal`)
            .setTitle('Globale Bot-Ankündigung');

        const typeInput = new TextInputBuilder()
            .setCustomId('announcement_type')
            .setLabel("Betreff / Typ")
            .setPlaceholder("z.B. Wartungsarbeiten oder System-Update")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const messageInput = new TextInputBuilder()
            .setCustomId('announcement_message')
            .setLabel("Inhalt der Ankündigung")
            .setPlaceholder("Beschreibe hier im Detail, worum es geht...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const firstRow = new ActionRowBuilder().addComponents(typeInput);
        const secondRow = new ActionRowBuilder().addComponents(messageInput);

        modal.addComponents(firstRow, secondRow);

        await interaction.showModal(modal);

        console.log("Ankündigung wurde verschickt");
    },

    
    
};
