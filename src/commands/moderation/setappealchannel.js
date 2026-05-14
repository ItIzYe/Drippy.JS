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
        try {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        } catch (err) {
            console.error("Fehler beim Defer:", err);
            return;
        }

        const targetChannel = interaction.options.getChannel('channel');

        try {
            await GuildConfig.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { appealChannelId: [targetChannel.id] },
                { upsert: true, new: true }
            );

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