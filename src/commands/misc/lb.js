const { 
    EmbedBuilder, 
    MessageFlags 
} = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
    name: 'leaderboard',
    description: 'Zeigt die Top 10 Level-Rangliste des Servers',
    testOnly: true,

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();


            const topPlayers = await Level.find({
                guildId: interaction.guild.id,
            })
            .sort({ level: -1, xp: -1 })
            .limit(10);

            if (!topPlayers.length) {
                return await interaction.editReply('Es gibt noch keine Daten für ein Leaderboard auf diesem Server.');
            }


            let leaderboardText = '';

            for (let i = 0; i < topPlayers.length; i++) {
                const data = topPlayers[i];
                

                const member = interaction.guild.members.cache.get(data.userId) || 
                               (await interaction.guild.members.fetch(data.userId).catch(() => null));

                const name = member ? member.user.username : `Unbekannter User (${data.userId})`;
                

                let rankEmoji = '';
                if (i === 0) rankEmoji = '🥇';
                else if (i === 1) rankEmoji = '🥈';
                else if (i === 2) rankEmoji = '🥉';
                else rankEmoji = `**${i + 1}.**`;

                leaderboardText += `${rankEmoji} **${name}**\n╰─ Level: \`${data.level}\` • XP: \`${data.xp.toLocaleString()}\`\n\n`;
            }


            const lbEmbed = new EmbedBuilder()
                .setTitle(`🏆 Level Leaderboard - ${interaction.guild.name}`)
                .setColor('#00fdfe')
                .setDescription(leaderboardText)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ 
                    text: `Abgefragt von ${interaction.user.username}`, 
                    iconURL: interaction.user.displayAvatarURL() 
                });

            await interaction.editReply({ embeds: [lbEmbed] });

        } catch (error) {
            console.error(`Fehler im Leaderboard-Command:`, error);
            if (interaction.deferred) {
                await interaction.editReply('Beim Laden des Leaderboards ist ein Fehler aufgetreten.');
            } else {
                await interaction.reply({ content: 'Ein Fehler ist aufgetreten.', flags: [MessageFlags.Ephemeral] });
            }
        }
    }
};