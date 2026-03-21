const welcomeMessageSchema = require('../../models/WelcomeChannel');
const { EmbedBuilder, Client, GuildMember } = require('discord.js');

module.exports = async (client, member) => { 
    try {
        if (member.user.bot) return;

        const welcomeConfigs = await welcomeMessageSchema.find({
            guildId: member.guild.id
        });

        if (!welcomeConfigs || welcomeConfigs.length === 0) return;

        for (const welcomeConfig of welcomeConfigs) {
            let targetChannel = member.guild.channels.cache.get(welcomeConfig.channelId) ||
                                (await member.guild.channels.fetch(welcomeConfig.channelId).catch(() => null));

            if (!targetChannel) {
                await welcomeMessageSchema.findOneAndDelete({
                    guildId: member.guild.id,
                    channelId: welcomeConfig.channelId
                }).catch(() => {});
                continue;
            }

            const customText = welcomeConfig.customMessage || 'Hey {username} 👋. Willkommen auf {server-name}!';
            const finalDescription = customText
                .replace('{mention-member}', `<@${member.id}>`)
                .replace('{username}', member.user.username)
                .replace('{server-name}', member.guild.name)
                .replace('{member-count}', String(member.guild.memberCount));

            const welcomeEmbed = new EmbedBuilder()
                .setColor("#00fdfe")
                .setTitle("Willkommen auf dem Server! 🎉")
                .setDescription(finalDescription)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: "👤 User:", value: `${member.user.tag}`, inline: true },
                    { name: "🔢 Mitglied Nr.:", value: `#${member.guild.memberCount}`, inline: true }
                )
                .setImage('https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtZnd6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3ZpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYC0LajbaPoEADu/giphy.gif')
                .setTimestamp()
                .setFooter({ text: `User-ID: ${member.id}` });

            await targetChannel.send({ 
                content: `Herzlich Willkommen ${member}!`, 
                embeds: [welcomeEmbed] 
            }).catch(() => {});
        }
    } catch (error) {
        console.error(`Fehler in ${__filename}:\n`, error);
    }
}; 