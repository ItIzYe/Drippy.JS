const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Feedback = require('../../models/Feedback'); // Pfad zu deinem Model (feedbacks_v2) anpassen

/**
 * ==========================================
 * TEAM-KONFIGURATION
 * (Muss mit deinem Feedback-Handler übereinstimmen!)
 * ==========================================
 */
const TEAM_LISTE = {
    streammods: [
        { label: "leongamer015", value: "774766550825697280" }, // { Name, Discord-ID }
        { label: "xxharald", value: "781434723037741056" },
        { label: "r.m.stitanic", value: "690582774641328168" },
        { label: "reverse [Verified Bot]", value: "802184421674844210" },
        { label: "pascaldaa", value: "425729507736158228" },
        { label: "Canadian Agent | Jury", value: "675723273937354775" },
        { label: "tt_justin", value: "735977580213043241" },
        { label: "Snake", value: "917857500328497172" },
        { label: "Marc_RKTSARMY", value: "795044613052301343" },
        { label: "hase282", value: "234693886579179522" },
    ],
    discordmods: [
        { label: "itizye", value: "716394389211185213" },
        { label: "r.m.stitanic", value: "690582774641328168" },
        { label: "Canadian Agent | Jury", value: "675723273937354775" },
        { label: "leongamer015", value: "774766550825697280" },
        { label: "xxharald", value: "781434723037741056" },
        { label: "alphaelu", value: "909608659481399297" },
        { label: "reverse [Verified Bot]", value: "802184421674844210" },
    ]
};

module.exports = {
    isGuildCommand: true, // Erscheint nur auf deinem Hauptserver
    name: 'rating',
    description: 'Zeigt die detaillierten Feedback-Statistiken eines Moderators an.',
    testOnly: false,
    options: [
        {
            name: 'moderator',
            description: 'Wähle den Moderator aus, dessen Statistik du sehen willst.',
            type: ApplicationCommandOptionType.User, // Sicherster Typ für Pings & IDs
            required: true,
        }
    ],

    callback: async (client, interaction) => {
        // Direkter Zugriff auf das User-Objekt (verhindert .replace() Fehler)
        const targetUser = interaction.options.getUser('moderator');
        const guildId = interaction.guild.id;

        // 1. SCHRITT: Team-Zugehörigkeit prüfen
        const istInStreamTeam = TEAM_LISTE.streammods.some(mod => mod.value === targetUser.id);
        const istInDiscordTeam = TEAM_LISTE.discordmods.some(mod => mod.value === targetUser.id);

        if (!istInStreamTeam && !istInDiscordTeam) {
            return await interaction.reply({
                content: `❌ **${targetUser.tag}** ist nicht in der Teamliste registriert.`,
                ephemeral: true
            });
        }

        // Defer, da MongoDB-Abfragen bei großen Arrays Zeit brauchen
        await interaction.deferReply();

        try {
            /**
             * 2. SCHRITT: MongoDB Abfrage-Logik
             * Wir suchen:
             * - Feedback direkt für diesen User
             * - Feedback für "all" in den Kategorien, in denen er Mod ist
             */
            const suchKriterien = [{ guildId, targetUser: targetUser.id }];

            if (istInStreamTeam) {
                suchKriterien.push({ guildId, targetType: 'streammods', targetUser: 'all' });
            }
            if (istInDiscordTeam) {
                suchKriterien.push({ guildId, targetType: 'discordmods', targetUser: 'all' });
            }

            const datensaetze = await Feedback.find({ $or: suchKriterien });

            let gesamtSterne = 0;
            let anzahlBewertungen = 0;
            let sterneVerteilung = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let textFeedbacks = [];

            // Daten aggregieren
            datensaetze.forEach(doc => {
                if (doc.ratings && Array.isArray(doc.ratings)) {
                    doc.ratings.forEach(rating => {
                        gesamtSterne += rating.stars;
                        anzahlBewertungen++;
                        if (sterneVerteilung[rating.stars] !== undefined) sterneVerteilung[rating.stars]++;

                        // Text-Feedbacks sammeln (Anonymität beachten)
                        if (rating.text && rating.text.trim().length > 0) {
                            const absender = rating.isAnonym ? "🕵️ Anonym" : `<@${rating.userId}>`;
                            textFeedbacks.push(`• **${rating.stars} ⭐** von ${absender}: *"${rating.text}"*`);
                        }
                    });
                }
            });

            if (anzahlBewertungen === 0) {
                return await interaction.editReply({
                    content: `📊 **${targetUser.username}** hat bisher noch keine Bewertungen erhalten.`
                });
            }

            const durchschnitt = (gesamtSterne / anzahlBewertungen).toFixed(2);

            // 3. SCHRITT: Visuelle Statistik (Balkendiagramm)
            let verteilungsText = "";
            for (let i = 5; i >= 1; i--) {
                const anzahl = sterneVerteilung[i];
                const prozent = (anzahl / anzahlBewertungen) * 10;
                const balken = "🟩".repeat(Math.round(prozent)) + "⬛".repeat(10 - Math.round(prozent));
                verteilungsText += `**${i} ⭐** ${balken} (${anzahl})\n`;
            }

            const rollenText = [];
            if (istInStreamTeam) rollenText.push("📺 Stream-Mod");
            if (istInDiscordTeam) rollenText.push("🛡️ Discord-Mod");

            const statsEmbed = new EmbedBuilder()
                .setColor("#deff9a")
                .setTitle(`Rating: ${targetUser.username}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setDescription(`Rolle: **${rollenText.join(" & ")}**\nStatistik inkl. Team-Bewertungen.`)
                .addFields(
                    { name: "Durchschnitt", value: `🏆 **${durchschnitt} / 5.00**`, inline: true },
                    { name: "Gesamt", value: `📈 **${anzahlBewertungen}** Feedbacks`, inline: true },
                    { name: "Verteilung", value: verteilungsText, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `Drippy Stats`, iconURL: client.user.displayAvatarURL() });

            if (textFeedbacks.length > 0) {
                const neueste = textFeedbacks.reverse().slice(0, 3);
                statsEmbed.addFields({ name: "Letzte Kommentare", value: neueste.join("\n") });
            }

            return await interaction.editReply({ embeds: [statsEmbed] });

        } catch (error) {
            console.error("Rating Error:", error);
            return await interaction.editReply({ content: "❌ Fehler beim Abrufen der Daten." });
        }
    }
};