const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

const VORSCHLAG_KANAL_ID = '888499697608699954'; 

module.exports = async (client, interaction) => {
    const customId = interaction.customId;

    if (interaction.isButton() && customId === 'oeffne_vorschlag_modal') {
        const modal = new ModalBuilder()
            .setCustomId('vorschlag_modal')
            .setTitle('Neuer Command-Vorschlag');

        const vorschlagInput = new TextInputBuilder()
            .setCustomId('vorschlag_text')
            .setLabel('Was für einen Command wünschst du dir?')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Beschreibe deine Idee so genau wie möglich...')
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(1000);

        const row = new ActionRowBuilder().addComponents(vorschlagInput);
        modal.addComponents(row);

        return await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && customId === 'vorschlag_modal') {
        const vorschlagText = interaction.fields.getTextInputValue('vorschlag_text');
        const zielKanal = client.channels.cache.get(VORSCHLAG_KANAL_ID);

        if (!zielKanal) {
            return interaction.reply({ 
                content: 'Fehler: Der Vorschläge-Kanal wurde nicht gefunden. Bitte die Entwickler informieren.', 
                ephemeral: true 
            });
        }

        const vorschlagEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📥 Neuer Command-Vorschlag!')
            .setDescription(vorschlagText)
            .addFields(
                { name: 'User', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: 'Server', value: `${interaction.guild?.name || 'Direktnachricht'} (${interaction.guild?.id || 'N/A'})`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Drippy.JS Feedback System`, iconURL: interaction.user.displayAvatarURL() });

        try {
            await zielKanal.send({ embeds: [vorschlagEmbed] });
            return await interaction.reply({ 
                content: 'Vielen Dank! Dein Vorschlag wurde erfolgreich an die Entwickler übermittelt.', 
                ephemeral: true 
            });
        } catch (error) {
            console.error('Fehler beim Weiterleiten des Vorschlags:', error);
            return await interaction.reply({ 
                content: 'Es gab einen Fehler beim Senden deines Vorschlags.', 
                ephemeral: true 
            });
        }
    }
};