const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const GuildConfig = require('../models/GuildConfiguration');
const discordTranscripts = require('discord-html-transcripts');

module.exports = async (client, interaction) => {
    const { guild, user, customId, member } = interaction;

    if (customId === 'ticket_open') {
        await interaction.deferReply({ Flags: [MessageFlags.Ephemeral] });

    

        const channelName = `ticket-${user.username.toLowerCase()}`;
        const existingChannel = guild.channels.cache.find(c => c.name === channelName);
        if (existingChannel) return interaction.editReply(`Du hast bereits ein offenes Ticket: ${existingChannel}`);


        const overwrites = [
            { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] }, // @everyone sieht nichts
            { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }, // Der User sieht es
            { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }, // Der Bot sieht es
        ];

        const staffRoles = guild.roles.cache.filter(role => 
            role.permissions.has(PermissionFlagsBits.ManageMessages) || 
            role.permissions.has(PermissionFlagsBits.Administrator)
        );

        staffRoles.forEach(role => {
            overwrites.push({
                id: role.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            });
        });

        try {
            const ticketChannel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                permissionOverwrites: overwrites,
            });

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🎫 Support Ticket')
                .setDescription(`Hallo ${user}, danke für deine Anfrage!\n\nDas Team (alle mit dem Recht \`Nachrichten verwalten\`) wurde benachrichtigt.`)
                .setFooter({ text: 'Nutze den Button unten zum Schließen.' });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('ticket_close').setLabel('Ticket schließen').setStyle(ButtonStyle.Danger).setEmoji('🔒'),
                new ButtonBuilder().setCustomId('ticket_transcript').setLabel('Transkript').setStyle(ButtonStyle.Secondary).setEmoji('📜'),
            );

            await ticketChannel.send({ content: `🔔 Support-Anfrage von ${user}`, embeds: [embed], components: [row] });
            await interaction.editReply({content: `✅ Dein Ticket wurde erstellt: ${ticketChannel}`, Flags: [MessageFlags.Ephemeral]});

        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Fehler beim Erstellen des Tickets. Hat der Bot "Manage Channels" Rechte?');
        }
    }

    if (customId === 'ticket_close') {
        if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: '❌ Nur Teammitglieder können Tickets schließen.', flags: [MessageFlags.Ephemeral] });
        }

        await interaction.reply('🔒 Ticket wird in 5 Sekunden gelöscht...');
        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }

    if (customId === 'ticket_transcript') {
        await interaction.deferReply();

        const config = await GuildConfig.findOne({ guildId: interaction.guild.id });
        if (!config || !config.ticketLogChannelId) {
            return interaction.editReply('❌ Es wurde noch kein Log-Kanal mit `/setup-logs` festgelegt!');
        }

        // KORREKTUR: Wir holen den Kanal und PRÜFEN ihn sofort
        const logChannel = interaction.guild.channels.cache.get(config.ticketLogChannelId) 
                   || await interaction.guild.channels.fetch(config.ticketLogChannelId).catch(() => null);
        
        if (!logChannel) {
    return interaction.editReply('❌ Der Log-Kanal wurde nicht gefunden. Bitte setze ihn mit /setup-logs neu.');
}

        try {
            // Transkript generieren
            const file = await discordTranscripts.createTranscript(interaction.channel, {
                limit: -1,
                fileName: `transcript-${interaction.channel.name}.html`,
                poweredBy: false
            });

            const embed = new EmbedBuilder()
                .setTitle('📜 Ticket Transkript')
                .addFields(
                    { name: 'Ticket', value: interaction.channel.name, inline: true },
                    { name: 'User', value: user.tag, inline: true }
                )
                .setColor(0x3498db)
                .setTimestamp();

            // Hier knallte es vorher (Zeile 98) – jetzt ist logChannel sicher definiert
            await logChannel.send({ embeds: [embed], files: [file] });
            await interaction.editReply('✅ Transkript wurde an den Log-Kanal gesendet!');
            
        } catch (err) {
            console.error("Fehler beim Senden des Transkripts:", err);
            await interaction.editReply('❌ Ein technischer Fehler ist beim Erstellen des Transkripts aufgetreten.');
        }
    }

};