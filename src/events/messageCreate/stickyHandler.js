const { EmbedBuilder } = require('discord.js');
const StickyMessage = require('../../models/StickyMessage');

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    const channelId = message.channel.id;

    // 1. In der Datenbank nachschauen, ob eine Sticky Message aktiv ist
    const stickyData = await StickyMessage.findOne({ guildId: message.guild.id, channelId: channelId });
    if (!stickyData) return;

    // Falls die geschriebene Nachricht die Sticky Message selbst war (Sicherheitsanker), ignorieren
    if (stickyData.lastMessageId && message.id === stickyData.lastMessageId) return;

    // 2. Counter um 1 erhöhen
    stickyData.messageCount += 1;

    // 3. Prüfen, ob das vom Admin eingestellte Limit erreicht wurde
    if (stickyData.messageCount >= stickyData.maxMessages) {
        // Counter sofort zurücksetzen, bevor asynchrone API-Anfragen laufen (Spam-Schutz!)
        stickyData.messageCount = 0;
        const lastMsgId = stickyData.lastMessageId;
        stickyData.lastMessageId = null;
        await stickyData.save();

        try {
            // Alte Nachricht löschen
            if (lastMsgId) {
                const oldMsg = await message.channel.messages.fetch(lastMsgId).catch(() => null);
                if (oldMsg) {
                    await oldMsg.delete().catch(() => {});
                }
            }

            // Neues Embed senden
            const embed = new EmbedBuilder()
                .setColor('#8BBEEF')
                .setDescription(`📌 **Wichtige Information:**\n\n${stickyData.messageText}`)
                .setTimestamp()
                .setFooter({ text: `${client.user.username} Sticky System` });

            const newStickyMsg = await message.channel.send({ embeds: [embed] });

            // Neue ID speichern
            stickyData.lastMessageId = newStickyMsg.id;
            await stickyData.save();

        } catch (error) {
            console.error('Fehler beim Rotieren der Sticky Message:', error);
        }
    } else {
        // Wenn das Limit noch nicht erreicht ist, speichern wir nur den neuen Zählerstand
        await stickyData.save();
    }
};