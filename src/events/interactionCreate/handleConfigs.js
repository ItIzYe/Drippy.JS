const { ChannelSelectMenuBuilder, ActionRowBuilder, MessageFlags } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');
const Language = require('../../models/LanguageSchema');
const language = require("../../handlers/languages");
const { createConfigDashboard } = require('../../commands/moderation/config-view');

module.exports = async (client, interaction) => {
    if (!interaction.isButton() && !interaction.isAnySelectMenu()) return;

    const { customId, guild } = interaction;

    if (customId.startsWith('cfg_')) {
        const category = customId.split('_')[1]; 
        
        if (category === 'close') return interaction.message.delete();

        if (category === 'toggle') {
            await interaction.deferUpdate(); 

            const langData = await Language.findOne({ _id: guild.id });
            const currentLang = langData ? langData.language.toLowerCase() : 'german';
            const newLang = currentLang === 'english' ? 'german' : 'english';

            // 1. In der Datenbank speichern
            await Language.findOneAndUpdate(
                { _id: guild.id },
                { language: newLang },
                { upsert: true }
            );

            if (typeof language.setLanguage === 'function') {
                language.setLanguage(guild, newLang);
            }

            const { embed, row1, row2, row3 } = await createConfigDashboard(guild, newLang);
            return await interaction.editReply({
                embeds: [embed],
                components: [row1, row2, row3]
            });
        }

        const fieldMap = {
            'tickets': 'ticketLogChannelId',
            'suggestions': 'suggestionChannelId',
            'moderation': 'moderationChannelId',
            'levels': 'levelChannelId',
            'announcements': 'announcementChannelId'
        };

        const dbField = fieldMap[category];
        if (!dbField) return; 

        const selectMenu = new ChannelSelectMenuBuilder()
            .setCustomId(`setchan_${category}_${dbField}`)
            .setPlaceholder(`Wähle den Kanal für ${category}...`)
            .setMaxValues(1);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        return await interaction.reply({ 
            content: `Wähle einen Kanal für **${category}**:`, 
            components: [row], 
            flags: [MessageFlags.Ephemeral]
        });
    }

    if (customId.startsWith('setchan_')) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        try {
            const [_, category, dbField] = customId.split('_');
            const selectedChannelId = interaction.values[0];

            await GuildConfiguration.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { [dbField]: [selectedChannelId] },
                { upsert: true }
            );

            await interaction.editReply({ 
                content: `✅ Kanal <#${selectedChannelId}> wurde für **${category}** gespeichert!` 
            });

            try {
                const { embed, row1, row2, row3 } = await createConfigDashboard(interaction.guild);
                
                if (interaction.message && interaction.message.editable) {
                    await interaction.message.edit({
                        embeds: [embed],
                        components: [row1, row2, row3]
                    });
                }
            } catch (editError) {
                console.log("Dashboard konnte nicht live aktualisiert werden.");
            }

        } catch (error) {
            console.error("FEHLER BEIM SPEICHERN:", error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: '❌ Fehler beim Speichern in der Datenbank.' });
            }
        }
    }
};