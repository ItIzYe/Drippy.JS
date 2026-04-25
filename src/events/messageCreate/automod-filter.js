const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const AutoModConfig = require('../../models/Automod');
const Filter = require('bad-words');
const filter = new Filter();

module.exports = async (client, message) => {
    // 1. Grundlegende Sicherheits-Checks
    if (!message || !message.guild || message.author.bot) return;

    try {
        // 2. Einstellungen aus der Datenbank laden
        let settings = await AutoModConfig.findOne({ guildId: message.guild.id });
        
        // Wenn kein AutoMod für diesen Server konfiguriert oder deaktiviert ist -> Abbruch
        if (settings && settings.enabled === false) return;

        // 3. Admin-Check: Moderatoren und Admins werden ignoriert
        if (message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

        // 4. Kanal-spezifische Konfiguration suchen
        // Wir nutzen das neue 'channelSettings' Array
        const channelConfig = settings.channelSettings?.find(c => c.channelId === message.channel.id);

        let shouldDelete = false;
        let reason = "";

        // --- FILTER-LOGIK ---

        // A. Link-Check (Wird nur ausgeführt, wenn nicht für diesen Kanal erlaubt)
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(message.content)) {
            if (!channelConfig?.allowLinks) {
                shouldDelete = true;
                reason = "Links sind in diesem Kanal nicht erlaubt.";
            }
        }

        // B. Bilder-Check (Wird nur ausgeführt, wenn nicht für diesen Kanal erlaubt)
        if (message.attachments.size > 0) {
            if (!channelConfig?.allowImages) {
                shouldDelete = true;
                reason = "Bilder sind in diesem Kanal nicht erlaubt.";
            }
        }

        // C. Wort-Check (Global, außer man fügt Ausnahmen hinzu)
        const lowerContent = message.content.toLowerCase();
        
        // Wir stellen sicher, dass customBannedWords ein Array ist, bevor wir .some nutzen
        const customWords = settings.customBannedWords || [];
        const hasBadWord = filter.isProfane(lowerContent) || 
                           customWords.some(word => lowerContent.includes(word.toLowerCase()));

        if (hasBadWord) {
            shouldDelete = true;
            reason = "Verbotene Wortwahl.";
        }

        // --- AKTION BEI VERSTOSS ---

        if (shouldDelete) {
            // Nachricht löschen (Fehler abfangen, falls sie schon weg ist)
            await message.delete().catch(() => null);

            // Schickes Embed als Warnung senden
            const warnEmbed = new EmbedBuilder()
                .setColor(0xFF4500) // Orange-Rot
                .setAuthor({ name: 'AutoMod Schutz', iconURL: client.user.displayAvatarURL() })
                .setDescription(`${message.author}, deine Nachricht wurde automatisch entfernt.`)
                .addFields({ name: 'Grund', value: `\`${reason}\`` })
                .setTimestamp();

            const warn = await message.channel.send({ embeds: [warnEmbed] });

            // Warnung nach 6 Sekunden wieder löschen, um den Kanal sauber zu halten
            setTimeout(() => warn.delete().catch(() => null), 6000);
        }

    } catch (err) {
        console.error("Kritischer AutoMod Filter Fehler:", err);
    }
};