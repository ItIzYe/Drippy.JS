const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Feedback = require('../../models/Feedback'); // Pfad zu feedbacks_v2 anpassen

// --- TEAM-LISTE ---
const TEAM_LISTE = {
    streammods: [
        { label: "leongamer015", value: "774766550825697280" }, // { Name, Discord-ID }
        { label: "xxharald", value: "781434723037741056" },
        { label: "r.m.stitanic", value: "690582774641328168" },
        { label: "reverse [Verified Bot]", value: "802184421674844210" },
        { label: "pascaldaa", value: "425729507736158228" },
        { label: "Canadian Agent | Jury", value: "675723273937354775" },
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
    isGuildCommand: false,
    name: 'rating',
    description: 'Zeigt die detaillierten Feedback-Statistiken eines Moderators an.',
    testOnly: false,
    options: [
        {
            name: 'moderator',
            description: 'Wähle den Moderator aus (Erwähnung oder ID), dessen Statistik du sehen willst.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    callback: async (client, interaction) => {
        const inputMod = interaction.options.getString('moderator');
        const guildId = interaction.guild.id;

        const targetUserId = inputMod.replace(/[<@!>]/g, '');

        let targetUser;
        try {
            targetUser = await client.users.fetch(targetUserId);
        } catch (err) {
            return await interaction.reply({
                content: "❌ Die angegebene Moderator-ID oder Erwähnung ist ungültig.",
                ephemeral: true
            });
        }

        const istInStreamTeam = TEAM_LISTE.streammods.some(mod => mod.value === targetUser.id);
        const istInDiscordTeam = TEAM_LISTE.discordmods.some(mod => mod.value === targetUser.id);

        if (!istInStreamTeam && !istInDiscordTeam) {
            return await interaction.reply({
                content: `❌ **${targetUser.tag}** ist in der Feedback-Teamliste nicht eingetragen. Statistiken können nur für registrierte Moderatoren abgerufen werden.`,
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            const suchKriterien = [];

            suchKriterien.push({ guildId, targetUser: targetUser.id });

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

            datensaetze.forEach(doc => {
                doc.ratings.forEach(rating => {
                    gesamtSterne += rating.stars;
                    anzahlBewertungen++;
                    
                    if (sterneVerteilung[rating.stars] !== undefined) {
                        sterneVerteilung[rating.stars]++;
                    }

                    if (rating.text && rating.text !== "" && rating.text !== "*Kein Text-Feedback abgegeben.*") {
                        const absender = rating.isAnonym ? "🕵️ Anonym" : `<@${rating.userId}>`;
                        textFeedbacks.push(`• **${rating.stars} ⭐** von ${absender}: *"${rating.text}"*`);
                    }
                });
            });

            if (anzahlBewertungen === 0) {
                return await interaction.editReply({
                    content: `📊 **${targetUser.username}** hat bisher noch kein Feedback oder Team-Feedback erhalten.`
                });
            }

            const durchschnitt = (gesamtSterne / anzahlBewertungen).toFixed(2);

            let verteilungsText = "";
            for (let i = 5; i >= 1; i--) {
                const anzahl = sterneVerteilung[i];
                const prozent = anzahlBewertungen > 0 ? (anzahl / anzahlBewertungen) * 10 : 0;
                const balken = "🟩".repeat(Math.round(prozent)) + "⬛".repeat(10 - Math.round(prozent));
                verteilungsText += `**${i} ⭐** ${balken} (${anzahl})\n`;
            }

            let rollenText = [];
            if (istInStreamTeam) rollenText.push("📺 Stream-Mod");
            if (istInDiscordTeam) rollenText.push("🛡️ Discord-Mod");

            // Das Info-Embed bauen
            const statsEmbed = new EmbedBuilder()
                .setColor("#deff9a")
                .setTitle(`Feedback-Profil: ${targetUser.username}`)
                .setDescription(`Rolle(n): **${rollenText.join(" & ")}**\nHier ist die Auswertung aller direkten Bewertungen sowie der anteiligen Team-Feedbacks.`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: "Gesamtdurchschnitt", value: `🏆 **${durchschnitt} / 5.00 ⭐**`, inline: true },
                    { name: "Bewertungen insgesamt", value: `📈 **${anzahlBewertungen} Mal** bewertet`, inline: true },
                    { name: "Sterne-Verteilung", value: verteilungsText, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `Drippy Analytics System`, iconURL: client.user.displayAvatarURL() });

            if (textFeedbacks.length > 0) {
                const neuesteFeedbacks = textFeedbacks.reverse().slice(0, 3); 
                statsEmbed.addFields({ name: "Letzte schriftliche Feedbacks", value: neuesteFeedbacks.join("\n"), inline: false });
            }

            return await interaction.editReply({ embeds: [statsEmbed] });

        } catch (error) {
            console.error("Fehler beim Berechnen des Ratings:", error);
            return await interaction.editReply({ content: "❌ Es gab einen Datenbankfehler beim Abrufen der Statistiken." });
        }
    }
};