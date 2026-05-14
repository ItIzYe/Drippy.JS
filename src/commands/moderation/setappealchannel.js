const { ApplicationCommandOptionType, PermissionFlagsBits, MessageFlags } = require('discord.js');
const GuildConfig = require('../../models/GuildConfiguration');

module.exports = {
    name: 'setappealchannel',
    description: 'Legt den Kanal für Appeals fest.',
    options: [
        {
            name: 'channel',
            description: 'Der Kanal, in den die Appeals gesendet werden sollen.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        // 1. SOFORT den Defer aufrufen, um die 3-Sekunden-Falle zu umgehen
        try {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        } catch (err) {
            console.error("Fehler beim Defer:", err);
            return;
        }

        const targetChannel = interaction.options.getChannel('channel');

        try {
            // 2. Datenbank-Operation (kann manchmal dauern)
            await GuildConfig.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { appealChannelId: [targetChannel.id] }, // WICHTIG: In appeal.js nutzt du .appealChannelIds[0], also hier als Array speichern!
                { upsert: true, new: true }
            );

            // 3. Finale Antwort (jetzt mit editReply, da wir deferReply genutzt haben)
            await interaction.editReply({ 
                content: `✅ Einspruch-Anfragen werden ab jetzt in ${targetChannel} gesendet.`, 
            });
        } catch (error) {
            console.error("Fehler beim Speichern der Config:", error);
            await interaction.editReply({ 
                content: "❌ Es gab einen Fehler beim Speichern der Konfiguration.", 
            });
        }
    }
};