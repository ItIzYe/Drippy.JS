const { MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const VerifyConfig = require('../../models/Verify');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;
    if (!['btn_captcha_verify'].includes(interaction.customId)) return;


    const modal = new ModalBuilder()
        .setCustomId(`captcha_modal`)
        .setTitle('Captcha');
    
    const typeInput = new TextInputBuilder()
        .setCustomId('captcha_id')
        .setLabel("ID")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(7)
        .setMinLength(7)
        .setRequired(true);
    
    const firstRow = new ActionRowBuilder().addComponents(typeInput);

    modal.addComponents(firstRow);

    await interaction.showModal(modal);

};