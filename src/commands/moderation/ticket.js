const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    name: 'ticket-setup',
    description: 'Erstellt das Ticket-System Panel.',
    options: [
        {
            name: 'channel',
            description: 'In welchem Kanal soll das Panel erscheinen?',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    //testOnly: true,

    callback: async (client, interaction) => {
        const targetChannel = interaction.options.getChannel('channel');

        const ticketEmbed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle('🎫 Support-Tickets')
            .setDescription('Klicke auf den Button unten, um ein privates Ticket zu erstellen und mit dem Team zu sprechen.')
            .setFooter({ text: 'Missbrauch des Systems führt zu einem Ausschluss.' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_open')
                .setLabel('Ticket öffnen')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📩')
        );

        await targetChannel.send({ embeds: [ticketEmbed], components: [row] });
        await interaction.reply({ content: '✅ Ticket-Panel wurde erstellt.', Flags: [MessageFlags.Ephemeral] });
    }
};