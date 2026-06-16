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

        // 1. Das Modal (Eingabefenster) erstellen
        const modal = new ModalBuilder()
            .setCustomId(`embed_modal_${interaction.id}`)
            .setTitle(language(guild, 'EP_MODAL_TITLE') || 'Embed Creator');

        // 2. Eingabefelder für das Modal definieren
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
            .setValue('#8BBEEF') // Deine Standard-Highlight-Farbe vorausgefüllt
            .setRequired(false);

        // Felder in ActionRows packen und dem Modal hinzufügen
        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(colorInput)
        );

        // Zeigt dem Admin das Pop-up Fenster
        await interaction.showModal(modal);

        // 3. Auf das Absenden des Modals warten (Timeout nach 5 Minuten)
        try {
            const modalSubmit = await interaction.awaitModalSubmit({
                filter: i => i.customId === `embed_modal_${interaction.id}`,
                time: 300000 
            });

            // Eingegebene Daten auslesen
            const embedTitle = modalSubmit.fields.getTextInputValue('embed_title');
            const embedDesc = modalSubmit.fields.getTextInputValue('embed_desc');
            let embedColor = modalSubmit.fields.getTextInputValue('embed_color') || '#8BBEEF';

            // Hex-Code Validierung (falls der Admin Blödsinn eintippt)
            if (!/^#([A-Fa-f0-9]{6})$/.test(embedColor)) {
                embedColor = '#8BBEEF'; // Fallback auf deine Farbe
            }

            // Das Vorschau-Embed bauen
            const previewEmbed = new EmbedBuilder()
                .setTitle(embedTitle)
                .setDescription(embedDesc)
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({ text: `Erstellt von ${member.user.username}`, iconURL: member.user.displayAvatarURL() });

            // Die Buttons für die Vorschau erstellen
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

            // Die Vorschau EPHEMER (nur für den Admin sichtbar) senden
            const response = await modalSubmit.reply({
                content: `ℹ️ **${language(guild, 'EP_PREVIEW_NOTE') || 'Vorschau deines Embeds. Nur du siehst diese Nachricht!'}**`,
                embeds: [previewEmbed],
                components: [buttons],
                ephemeral: true,
                fetchReply: true
            });

            // 4. Collector für die Buttons erstellen (Timeout nach 2 Minuten)
            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 120000
            });

            collector.on('collect', async (btnInteraction) => {
                if (btnInteraction.customId === 'send_embed') {
                    // Embed öffentlich in den aktuellen Kanal posten
                    await btnInteraction.channel.send({ embeds: [previewEmbed] });
                    
                    // Vorschau-Nachricht beim Admin aktualisieren und Buttons entfernen
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
                // Wenn die Zeit abgelaufen ist, entfernen wir die Buttons aus der Vorschau
                if (reason === 'time') {
                    await modalSubmit.editReply({
                        content: `⏰ **${language(guild, 'EP_TIMEOUT') || 'Zeit abgelaufen. Bitte nutze den Befehl erneut.'}**`,
                        components: []
                    }).catch(() => {});
                } else {
                    // Bei Erfolg/Abbruch die Buttons einfach sauber löschen
                    await modalSubmit.editReply({ components: [] }).catch(() => {});
                }
            });

        } catch (err) {
            // Fängt ab, wenn der Admin das Modal einfach schließt ohne zu senden
            console.log("Modal wurde nicht innerhalb der Zeit ausgefüllt oder geschlossen.");
        }
    }
}