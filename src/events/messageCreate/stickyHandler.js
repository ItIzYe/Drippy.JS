const { EmbedBuilder } = require('discord.js');
const StickyMessage = require('../../models/StickyMessage');

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    const channelId = message.channel.id;

    const stickyData = await StickyMessage.findOne({ guildId: message.guild.id, channelId: channelId });
    if (!stickyData) return;

    if (stickyData.lastMessageId && message.id === stickyData.lastMessageId) return;

    stickyData.messageCount += 1;

    if (stickyData.messageCount >= stickyData.maxMessages) {
        stickyData.messageCount = 0;
        const lastMsgId = stickyData.lastMessageId;
        stickyData.lastMessageId = null;
        await stickyData.save();

        try {
            if (lastMsgId) {
                const oldMsg = await message.channel.messages.fetch(lastMsgId).catch(() => null);
                if (oldMsg) {
                    await oldMsg.delete().catch(() => {});
                }
            }

            const embed = new EmbedBuilder()
                .setColor('#8BBEEF')
                .setDescription(`📌 **Wichtige Information:**\n\n${stickyData.messageText}`)
                .setTimestamp()
                .setFooter({ text: `${client.user.username} Sticky System` });

            const newStickyMsg = await message.channel.send({ embeds: [embed] });

            stickyData.lastMessageId = newStickyMsg.id;
            await stickyData.save();

        } catch (error) {
            console.error('Fehler beim Rotieren der Sticky Message:', error);
        }
    } else {
        await stickyData.save();
    }
};