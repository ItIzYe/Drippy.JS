const GuildConfiguration = require('../../models/GuildConfiguration');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags // WICHTIG für die Flags
} = require('discord.js');

module.exports = {
    name: 'setappealchannel',
    description: 'Legt den Kanal für Entbannungs-Anträge (Appeals) fest.',
    options: [
        {
            name: 'channel',
            description: 'Der Kanal, in dem die Appeals erscheinen sollen.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.SendMessages],

    callback: async (client, interaction) => {
        // SOFORT auf die Interaction reagieren, um "Unknown Interaction" zu vermeiden
        // Und die neue Flag-Schreibweise nutzen
        try {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        } catch (err) {
            console.error("Fehler beim Defer:", err);
            return;
        }

        const { guild } = interaction;
        const targetChannelId = interaction.options.get('channel').value;

        try {
            let guildConfiguration = await GuildConfiguration.findOne({ guildId: guild.id });

            if (!guildConfiguration) {
                guildConfiguration = new GuildConfiguration({
                    guildId: guild.id,
                    appealChannelIds: [targetChannelId],
                });
            } else {
                guildConfiguration.appealChannelIds = [targetChannelId];
            }

            await guildConfiguration.save();

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Konfiguration Aktualisiert')
                .setDescription(`Einsprüche werden ab sofort in <#${targetChannelId}> geloggt.`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.log(`Fehler in setappealchannel: ${error}`);
            // Prüfen, ob die Interaction noch valide ist, bevor wir editieren
            if (interaction.deferred) {
                await interaction.editReply('Es gab einen Fehler beim Speichern der Konfiguration.');
            }
        }
    },
};