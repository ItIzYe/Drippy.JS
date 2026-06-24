const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'setup-vorschlag',
    description: 'Erstellt die Nachricht mit dem Vorschläge-Button.',
    permissionsRequired: [PermissionFlagsBits.ManageGuild],
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    //deleted: false,

    async callback(client, interaction) {
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('💡 Ideen gesucht!')
            .setDescription('Wir sind auf der Suche nach neuen Ideen für Bot-Commands! Wenn du eine coole Idee hast, klicke einfach auf den Button unten und teile sie uns mit.')
            .setFooter({ text: 'Dein Feedback hilft uns, den Bot besser zu machen!' });

        const button = new ButtonBuilder()
            .setCustomId('oeffne_vorschlag_modal')
            .setLabel('Vorschlag einreichen')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📥');

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({ 
            content: 'Die Feedback-Nachricht wurde erfolgreich erstellt!', 
            ephemeral: true 
        });

        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};