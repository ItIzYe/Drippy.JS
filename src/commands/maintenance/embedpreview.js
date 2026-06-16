const { 
    EmbedBuilder, 
    Client, 
    Interaction, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType 
} = require('discord.js');
const language = require("../../handlers/languages");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "embed-preview",
    description: "Create and preview an embed before sending it",
    //testOnly: true,

    callback: async (client, interaction) => {
        const { guild, member } = interaction;

        const modal = new ModalBuilder()
            .setCustomId(`embed_modal_${interaction.id}`)
            .setTitle(language(guild, 'EP_MODAL_TITLE') || 'Embed Creator');

        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel(language(guild, 'EP_LABEL_TITLE') || 'Titel')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('z.B. Wichtige Ankündigung!')
            .setRequired(true);

        const descInput = new TextInputBuilder()
            .setCustomId('embed_desc')
            .setLabel(language(guild, 'EP_LABEL_DESC') || 'Beschreibung')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Hier kommt dein formatierter Text rein...')
            .setRequired(true);

        const colorInput = new TextInputBuilder()
            .setCustomId('embed_color')
            .setLabel(language(guild, 'EP_LABEL_COLOR') || 'Farbe (Hex-Code)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('z.B. #8BBEEF')
            .setValue('#8BBEEF')
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(colorInput)
        );

        await interaction.showModal(modal);

        try {
            const modalSubmit = await interaction.awaitModalSubmit({
                filter: i => i.customId === `embed_modal_${interaction.id}`,
                time: 300000 
            });

            const embedTitle = modalSubmit.fields.getTextInputValue('embed_title');
            const embedDesc = modalSubmit.fields.getTextInputValue('embed_desc');
            let embedColor = modalSubmit.fields.getTextInputValue('embed_color') || '#8BBEEF';

            if (!/^#([A-Fa-f0-9]{6})$/.test(embedColor)) {
                embedColor = '#8BBEEF';
            }

            const previewEmbed = new EmbedBuilder()
                .setTitle(embedTitle)
                .setDescription(embedDesc)
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({ text: `Erstellt von ${member.user.username}`, iconURL: member.user.displayAvatarURL() });

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('send_embed')
                    .setLabel(language(guild, 'EP_BTN_SEND') || 'Senden')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancel_embed')
                    .setLabel(language(guild, 'EP_BTN_CANCEL') || 'Verwerfen')
                    .setStyle(ButtonStyle.Danger)
            );

            const response = await modalSubmit.reply({
                content: `ℹ️ **${language(guild, 'EP_PREVIEW_NOTE') || 'Vorschau deines Embeds. Nur du siehst diese Nachricht!'}**`,
                embeds: [previewEmbed],
                components: [buttons],
                ephemeral: true,
                fetchReply: true
            });

            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 120000
            });

            collector.on('collect', async (btnInteraction) => {
                if (btnInteraction.customId === 'send_embed') {
                    await btnInteraction.channel.send({ embeds: [previewEmbed] });
                    
                    await btnInteraction.reply({
                        content: `✅ **${language(guild, 'EP_SUCCESS') || 'Embed erfolgreich gesendet!'}**`,
                        ephemeral: true
                    });
                    collector.stop('sent');
                } else if (btnInteraction.customId === 'cancel_embed') {
                    await btnInteraction.reply({
                        content: `🗑️ **${language(guild, 'EP_CANCELLED') || 'Vorschau verworfen.'}**`,
                        ephemeral: true
                    });
                    collector.stop('cancelled');
                }
            });

            collector.on('end', async (_, reason) => {
                if (reason === 'time') {
                    await modalSubmit.editReply({
                        content: `⏰ **${language(guild, 'EP_TIMEOUT') || 'Zeit abgelaufen. Bitte nutze den Befehl erneut.'}**`,
                        components: []
                    }).catch(() => {});
                } else {
                    await modalSubmit.editReply({ components: [] }).catch(() => {});
                }
            });

        } catch (err) {
            console.log("Modal wurde nicht innerhalb der Zeit ausgefüllt oder geschlossen.");
        }
    }
}