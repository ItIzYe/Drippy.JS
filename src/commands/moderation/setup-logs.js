const { ApplicationCommandOptionType, PermissionFlagsBits, MessageFlags } = require('discord.js');
const GuildConfig = require('../../models/GuildConfiguration');

module.exports = {
    name: 'setup-logs',
    description: 'Legt den Kanal für Ticket-Transkripte fest.',
    options: [
        {
            name: 'channel',
            description: 'Der Kanal, in den die Transkripte gesendet werden sollen.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    //testOnly: true
    deleted: true,

    callback: async (client, interaction) => {
        const targetChannel = interaction.options.getChannel('channel');

        await GuildConfig.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { ticketLogChannelId: targetChannel.id },
            { upsert: true }
        );

        await interaction.reply({ 
            content: `✅ Transkripte werden ab jetzt in ${targetChannel} gesendet.`, 
            flags: [MessageFlags.Ephemeral] 
        });
    }
};