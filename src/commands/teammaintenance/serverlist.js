const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'serverlist',
    description: 'Zeigt eine Liste aller Server an, auf denen der Bot aktiv ist.',
    devOnly: true,

    callback: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const guilds = client.guilds.cache;
        
        const embed = new EmbedBuilder()
            .setTitle(`Server-Liste (${guilds.size} Server)`)
            .setColor('#2b2d31')
            .setTimestamp();

        let descriptionText = '';

        guilds.forEach((guild) => {
            const memberCount = guild.memberCount;
            const description = guild.description ? guild.description : 'Keine Beschreibung vorhanden.';
            
            descriptionText += `**${guild.name}**\n`;
            descriptionText += `👥 Mitglieder: \`${memberCount}\`\n`;
            descriptionText += `📝 Beschreibung: *${description}*\n`;
            descriptionText += `🆔 ID: \`${guild.id}\`\n\n`;
        });

        if (descriptionText.length > 4095) {
            embed.setDescription(descriptionText.substring(0, 4090) + '...');
        } else {
            embed.setDescription(descriptionText || 'Der Bot befindet sich auf keinen Servern.');
        }

        await interaction.editReply({ embeds: [embed] });
    },
};