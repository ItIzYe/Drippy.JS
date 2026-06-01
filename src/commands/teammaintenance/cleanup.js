const { PermissionFlagsBits, MessageFlags } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');

module.exports = {
    name: 'db-cleanup',
    description: 'Entfernt Daten von Servern, auf denen der Bot nicht mehr ist.',
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        await interaction.deferReply({ Flags: MessageFlags.Ephemeral });

        try {
            const allDbConfigs = await GuildConfiguration.find().select('guildId');
            
            const activeGuildIds = new Set(client.guilds.cache.map(guild => guild.id));

            const staleConfigs = allDbConfigs.filter(config => !activeGuildIds.has(config.guildId));

            if (staleConfigs.length === 0) {
                return await interaction.editReply({
                    content: '✅ Die Datenbank ist bereits sauber. Keine verwaisten Einträge gefunden.'
                });
            }

            const idsToDelete = staleConfigs.map(config => config.guildId);

            const deleteResult = await GuildConfiguration.deleteMany({
                guildId: { $in: idsToDelete }
            });

            await interaction.editReply({
                content: `🧹 Cleanup abgeschlossen!\nEs wurden **${deleteResult.deletedCount}** verwaiste Server-Konfigurationen gelöscht.`
            });

            console.log(`[Cleanup] ${deleteResult.deletedCount} Einträge entfernt.`);

        } catch (error) {
            console.error('Fehler beim Cleanup:', error);
            await interaction.editReply('❌ Ein Fehler ist beim Bereinigen der Datenbank aufgetreten.');
        }
    },
};