const { PermissionFlagsBits } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');

module.exports = {
    name: 'db-cleanup',
    description: 'Entfernt Daten von Servern, auf denen der Bot nicht mehr ist.',
    // Nur für Admins oder besser: Bot-Owner
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        try {
            // 1. Alle Guild-IDs aus der Datenbank abrufen
            const allDbConfigs = await GuildConfiguration.find().select('guildId');
            
            // 2. Aktuelle Server-IDs des Bots in ein Set packen (für schnellen Vergleich)
            const activeGuildIds = new Set(client.guilds.cache.map(guild => guild.id));

            // 3. IDs finden, die in der DB sind, aber NICHT mehr im Cache des Bots
            const staleConfigs = allDbConfigs.filter(config => !activeGuildIds.has(config.guildId));

            if (staleConfigs.length === 0) {
                return await interaction.editReply({
                    content: '✅ Die Datenbank ist bereits sauber. Keine verwaisten Einträge gefunden.'
                });
            }

            // 4. Die verwaisten IDs extrahieren
            const idsToDelete = staleConfigs.map(config => config.guildId);

            // 5. Aus der Datenbank löschen
            const deleteResult = await GuildConfiguration.deleteMany({
                guildId: { $in: idsToDelete }
            });

            // 6. Rückmeldung geben
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