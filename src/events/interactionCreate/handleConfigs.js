const { ChannelSelectMenuBuilder, ActionRowBuilder, ComponentType, MessageFlags } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');
// Wir importieren die Dashboard-Funktion, um das Embed live zu aktualisieren
const { createConfigDashboard } = require('../../commands/moderation/config-view');

module.exports = async (client, interaction) => {
    // 1. Filter: Wir lassen nur Buttons und alle Arten von Select Menus durch
    if (!interaction.isButton() && !interaction.isAnySelectMenu()) return;

    const { customId } = interaction;

    if (customId.startsWith('cfg_')) {
        const category = customId.split('_')[1];
        if (category === 'close') return interaction.message.delete();

        const fieldMap = {
            'tickets': 'ticketLogChannelId',
            'suggestions': 'suggestionChannelId',
            'moderation': 'moderationChannelId',
            'levels': 'levelChannelId',
            'announcements': 'announcementChannelId'
        };

        const dbField = fieldMap[category];

        const selectMenu = new ChannelSelectMenuBuilder()
            .setCustomId(`setchan_${category}_${dbField}`)
            .setPlaceholder(`Wähle den Kanal für ${category}...`)
            .setMaxValues(1);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        return await interaction.reply({ 
            content: `Wähle einen Kanal für **${category}**:`, 
            components: [row], 
            Flags: [MessageFlags.Ephemeral] 
        });
    }

    if (customId.startsWith('setchan_')) {
        await interaction.deferReply({ Flags: [MessageFlags.Ephemeral] });

        try {
            const [_, category, dbField] = customId.split('_');
            const selectedChannelId = interaction.values[0];

            // 1. SCHRITT: In der DB speichern
            await GuildConfiguration.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { [dbField]: [selectedChannelId] },
                { upsert: true }
            );

            // 2. SCHRITT: Erfolgsmeldung an den User (privat)
            await interaction.editReply({ 
                content: `✅ Kanal <#${selectedChannelId}> wurde für **${category}** gespeichert!` 
            });

            // 3. SCHRITT: LIVE UPDATE des Dashboards
            // Wir packen das in ein eigenes try-catch, damit ein 10008 Fehler (Unknown Message)
            // den Bot nicht crasht, falls die Dashboard-Nachricht weg ist.
            try {
                const { embed, row1, row2 } = await createConfigDashboard(interaction.guild);
                
                // Wir prüfen, ob interaction.message existiert und ob wir sie bearbeiten dürfen
                if (interaction.message && interaction.message.editable) {
                    await interaction.message.edit({
                        embeds: [embed],
                        components: [row1, row2]
                    });
                }
            } catch (editError) {
                // Leiser Log, falls das Dashboard-Update fehlschlägt
                console.log("Dashboard konnte nicht live aktualisiert werden (Nachricht evtl. nicht mehr vorhanden).");
            }

        } catch (error) {
            console.error("FEHLER BEIM SPEICHERN:", error);
            // Sicherheits-Check, ob wir überhaupt noch antworten können
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: '❌ Fehler beim Speichern in der Datenbank.' });
            }
        }
    }
};