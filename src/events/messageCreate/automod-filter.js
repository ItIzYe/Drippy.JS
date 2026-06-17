const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const AutoModConfig = require('../../models/Automod');
const Filter = require('bad-words');
const filter = new Filter();

module.exports = async (client, message) => {
    if (!message || !message.guild || message.author.bot) return;

    try {
        let settings = await AutoModConfig.findOne({ guildId: message.guild.id });
        if (!settings || settings.enabled === false) return;
        if (message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

        const channelConfig = settings.channelSettings?.find(c => c.channelId === message.channel.id);

        let shouldDelete = false;
        let reason = "";
        let triggeredWord = "";

        // --- FILTER-LOGIK ---

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(message.content)) {
            if (!channelConfig?.allowLinks) {
                shouldDelete = true;
                reason = "Links sind in diesem Kanal nicht erlaubt.";
            }
        }

        if (message.attachments.size > 0) {
            if (!channelConfig?.allowImages) {
                shouldDelete = true;
                reason = "Bilder sind in diesem Kanal nicht erlaubt.";
            }
        }

        if (!shouldDelete) {
            const wordsInMessage = message.content.toLowerCase().split(/\s+/);
            const customWords = settings.customBannedWords || [];
            const whitelist = settings.whitelistedWords || [];

            for (const word of wordsInMessage) {
                const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
                if (!cleanWord) continue;

                if (whitelist.map(w => w.toLowerCase()).includes(cleanWord)) continue;

                const matchedCustom = customWords.find(cw => cleanWord === cw.toLowerCase().trim());
                
                const isProfane = filter.isProfane(cleanWord);

                if (matchedCustom) {
                    shouldDelete = true;
                    triggeredWord = matchedCustom;
                    reason = "Verbotene Wortwahl.";
                    break;
                } else if (isProfane) {
                    shouldDelete = true;
                    triggeredWord = cleanWord;
                    reason = "Verbotene Wortwahl (Filter-Match).";
                    break;
                }
            }
        }


        if (shouldDelete) {
            await message.delete().catch(() => null);

            const warnEmbed = new EmbedBuilder()
                .setColor(0xFF4500)
                .setAuthor({ name: 'AutoMod Schutz', iconURL: client.user.displayAvatarURL() })
                .setDescription(`${message.author}, deine Nachricht wurde automatisch entfernt.`)
                .setTimestamp();

            if (triggeredWord) {
                warnEmbed.addFields(
                    { name: 'Grund', value: `\`${reason}\``, inline: true },
                    { name: 'Erkanntes Wort', value: `\`${triggeredWord}\``, inline: true }
                );
            } else {
                warnEmbed.addFields({ name: 'Grund', value: `\`${reason}\`` });
            }

            const warn = await message.channel.send({ embeds: [warnEmbed] });
            setTimeout(() => warn.delete().catch(() => null), 6000);
        }

    } catch (err) {
        console.error("Kritischer AutoMod Filter Fehler:", err);
    }
};