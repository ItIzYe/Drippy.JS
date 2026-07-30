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
    name: 'umfrage',
    description: 'Öffnet ein Fenster für eine globale Bot-Ankündigung',
    devOnly: false, // Nur für dich als Developer
    testOnly: false,
    //deleted: true,

    callback: async (client, interaction) => {
        const modal = new ModalBuilder()
            .setCustomId(`umfrage_modal`)
            .setTitle('Captcha Feedback');

        const messageInput = new TextInputBuilder()
            .setCustomId('umfrage_message')
            .setLabel("Feedback")
            .setPlaceholder("Beschreibe hier, woran es liegt...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const secondRow = new ActionRowBuilder().addComponents(messageInput);

        modal.addComponents(secondRow);

        await interaction.showModal(modal);

        console.log("Ankündigung wurde verschickt");
    },

    
    
};
