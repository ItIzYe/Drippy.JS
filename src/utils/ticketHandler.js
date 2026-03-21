const { 
    ChannelType, 
    PermissionFlagsBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

module.exports = async (client, interaction) => {
    const { guild, user, customId } = interaction;

    if (customId === 'ticket_open') {
        await interaction.deferReply({ ephemeral: true });

        // Check, ob der User bereits ein Ticket offen hat (optional)
        const existingTicket = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
        if (existingTicket) {
            return interaction.editReply({ content: `Du hast bereits ein offenes Ticket: ${existingTicket}` });
        }

        try {
            // Erstellt den Kanal
            const ticketChannel = await guild.channels.create({
                name: `ticket-${user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.id, // @everyone sieht nichts
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: user.id, // Der User sieht den Kanal
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                    {
                        id: client.user.id, // Der Bot sieht den Kanal
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    // HIER: Füge die ID deiner Team-Rolle hinzu, damit Supporter das Ticket sehen
                    /* {
                        id: 'DEINE_TEAM_ROLLEN_ID', 
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    }, */
                ],
            });

            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('🎫 Ticket Erstellt')
                .setDescription(`Hallo ${user}, beschreibe dein Anliegen bitte so genau wie möglich.\nEin Teammitglied wird bald hier sein.`)
                .setTimestamp();

            const closeButton = new ButtonBuilder()
                .setCustomId('ticket_close')
                .setLabel('Ticket schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒');

            const row = new ActionRowBuilder().addComponents(closeButton);

            await ticketChannel.send({ content: `${user} | <@&DEINE_TEAM_ROLLEN_ID>`, embeds: [welcomeEmbed], components: [row] });

            await interaction.editReply({ content: `Dein Ticket wurde erstellt: ${ticketChannel}` });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'Fehler beim Erstellen des Tickets.' });
        }
    }

    if (customId === 'ticket_close') {
        await interaction.reply({ content: 'Dieses Ticket wird in 5 Sekunden geschlossen...' });
        
        setTimeout(async () => {
            await interaction.channel.delete().catch(() => null);
        }, 5000);
    }
};