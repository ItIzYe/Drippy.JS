const { 
    ApplicationCommandOptionType, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionFlagsBits 
} = require('discord.js');

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

    callback: async (client, interaction) => {
        const targetChannel = interaction.options.getChannel('channel');

        const ticketEmbed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('📩 Support-Ticket')
            .setDescription('Klicke auf den Button unten, um ein privates Ticket zu eröffnen. Unser Team wird sich so schnell wie möglich um dich kümmern!')
            .setFooter({ text: 'Bitte eröffne nur ein Ticket bei echten Problemen.' });

        const openButton = new ButtonBuilder()
            .setCustomId('ticket_open')
            .setLabel('Ticket erstellen')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📩');

        const row = new ActionRowBuilder().addComponents(openButton);

        await targetChannel.send({ embeds: [ticketEmbed], components: [row] });

        await interaction.reply({ 
            content: `✅ Ticket-Panel wurde in ${targetChannel} erstellt.`, 
            ephemeral: true 
        });
    }
};