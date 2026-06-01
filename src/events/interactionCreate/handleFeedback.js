const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    EmbedBuilder,
    UserSelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require('discord.js');
const Feedback = require('../../models/Feedback');

const KANAL_STREAM_MODS = "888499697608699954"; 
const KANAL_DISCORD_MODS = "888499697608699954"; 

// ==========================================
// DIE TEAM-LISTE (Hier trägst du die Mods ein)
// ==========================================
const TEAM_LISTE = {
    streammods: [
        { label: "leongamer015", value: "774766550825697280" }, // { Name, Discord-ID }
        { label: "xxharald", value: "781434723037741056" },
        { label: "r.m.stitanic", value: "690582774641328168" },
        { label: "reverse [Verified Bot]", value: "802184421674844210" },
        { label: "pascaldaa", value: "425729507736158228" }
        { label: "Canadian Agent | Jury", value: "675723273937354775" }
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


module.exports = async (client, interaction) => {
    
    // ==========================================
    // 1. SCHRITT: KATEGORIE GEWÄHLT (Aus dem permanenten Embed)
    // ==========================================
    if (interaction.isStringSelectMenu() && interaction.customId === 'feedback_target_select') {
        const target = interaction.values[0]; // 'streammods' oder 'discordmods'

        // Hole die passende Liste basierend auf der Auswahl
        const ausgewaehlteMods = TEAM_LISTE[target];

        if (!ausgewaehlteMods || ausgewaehlteMods.length === 0) {
            return await interaction.reply({
                content: "Für diese Kategorie sind aktuell keine Moderatoren eingetragen.",
                ephemeral: true
            });
        }

        // Erstelle das manuelle Text-Dropdown
        const stringSelect = new StringSelectMenuBuilder()
            .setCustomId(`feedback_user_select_${target}`)
            .setPlaceholder('Wähle den Moderator aus...');

        // Füge die Mods aus deiner Liste als Optionen hinzu
        ausgewaehlteMods.forEach(mod => {
            stringSelect.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(mod.label)
                    .setValue(mod.value) // Hier wird die Discord-ID im Hintergrund übergeben
            );
        });

        // Button für das gesamte Team
        const allButton = new ButtonBuilder()
            .setCustomId(`feedback_user_all_${target}`)
            .setLabel('Gilt dem gesamten Team')
            .setStyle(ButtonStyle.Secondary);

        const row1 = new ActionRowBuilder().addComponents(stringSelect);
        const row2 = new ActionRowBuilder().addComponents(allButton);

        return await interaction.reply({
            content: `Du hast **${target === 'streammods' ? 'Stream-Mods' : 'Discord-Mods'}** gewählt. Für wen genau ist das Feedback?`,
            components: [row1, row2],
            ephemeral: true
        });
    }

// ==========================================
// 2. SCHRITT: MODERATOR WURDE GEWÄHLT (Aus der Liste oder "Alle")
// ==========================================

const isModSelect = interaction.isStringSelectMenu() && interaction.customId.startsWith('feedback_user_select_');
const isAllButton = interaction.isButton() && interaction.customId.startsWith('feedback_user_all_');

if (isModSelect || isAllButton) {
    // Da wir editReply nutzen, müssen wir Discord sofort signalisieren, dass wir arbeiten
    await interaction.deferUpdate(); 

    let target, modId;

    if (isModSelect) {
        target = interaction.customId.split('_')[3]; // streammods oder discordmods
        modId = interaction.values[0]; // Die Discord-ID des ausgewählten Mods
    } else {
        target = interaction.customId.split('_')[3];
        modId = "all";
    }

    // 1-5 Sterne-Buttons generieren
    const row = new ActionRowBuilder();
    for (let i = 1; i <= 5; i++) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`feedback_stars_${target}_${modId}_${i}`)
                .setLabel(`${i} ⭐`)
                .setStyle(ButtonStyle.Success)
        );
    }

    const targetName = modId === "all" ? "das gesamte Team" : `<@${modId}>`;
    
    // GEÄNDERT: .editReply statt .update verwenden!
    return await interaction.editReply({
        content: `Feedback für: ${targetName}\nWie viele Sterne möchtest du geben?`,
        components: [row]
    }).catch(err => console.error("Fehler beim Editieren der Mod-Auswahl:", err));
}

    // ==========================================
    // 3. SCHRITT: STERNE GEKLICKT -> MODAL ÖFFNEN
    // ==========================================
    if (interaction.isButton() && interaction.customId.startsWith('feedback_stars_')) {
    const [,, target, modId, stars] = interaction.customId.split('_');

    const modal = new ModalBuilder()
        .setCustomId(`feedback_modal_${target}_${modId}_${stars}`)
        .setTitle('Feedback schreiben');

    const textInput = new TextInputBuilder()
        .setCustomId('feedback_text')
        .setLabel('Dein Feedback:')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Schreibe hier deine Nachricht (optional)...')
        .setRequired(false)
        .setMaxLength(1000);

    const anonymInput = new TextInputBuilder()
        .setCustomId('feedback_anonym')
        .setLabel('Anonym einsenden? (Schreibe "ja")')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('ja / nein')
        .setRequired(false)
        .setMaxLength(4);

    const row1 = new ActionRowBuilder().addComponents(textInput);
    const row2 = new ActionRowBuilder().addComponents(anonymInput);
    modal.addComponents(row1, row2);

    await interaction.showModal(modal);

    return await interaction.editReply({
        content: `Das Feedback-Fenster wurde geöffnet!`,
        components: []
    }).catch(() => null);
}

    // ==========================================
    // 4. SCHRITT: MODAL ABSENDEN & LOGGEN
    // ==========================================
    if (interaction.isModalSubmit() && interaction.customId.startsWith('feedback_modal_')) {
        const [,, target, modId, stars] = interaction.customId.split('_');
        
        const feedbackText = interaction.fields.getTextInputValue('feedback_text').trim() || "*Kein Text-Feedback abgegeben.*";
        const anonymText = interaction.fields.getTextInputValue('feedback_anonym').toLowerCase().trim();
        
        const isAnonym = anonymText === 'ja' || anonymText === 'j';
        const { guild, user } = interaction;

        await interaction.deferReply({ ephemeral: true });

        try {
    const starEmojis = "⭐".repeat(parseInt(stars));
    const userField = isAnonym ? "🕵️ Anonymes Mitglied" : `${user.tag} (${user.id})`;
    const targetField = modId === "all" ? "Gesamtes Team" : `<@${modId}>`;

    // NEU: Wir pushen die Bewertung direkt in das Array des Moderators
    await Feedback.findOneAndUpdate(
        { guildId: guild.id, targetType: target, targetUser: modId },
        { 
            $push: { 
                ratings: {
                    userId: user.id,
                    stars: parseInt(stars),
                    text: feedbackText !== "*Kein Text-Feedback abgegeben.*" ? feedbackText : "",
                    isAnonym: isAnonym,
                    timestamp: new Date()
                }
            }
        },
        { upsert: true, new: true }
    );

    // Embed für das Team bauen
    const logEmbed = new EmbedBuilder()
        .setColor(target === 'streammods' ? "#3498db" : "#9b59b6")
        .setTitle(`Neues Feedback: ${target === 'streammods' ? '📺 Stream-Team' : '🛡️ Discord-Team'}`)
        .addFields(
            { name: "Eingereicht von", value: userField, inline: true },
            { name: "Bewertung", value: `${starEmojis} (${stars}/5)`, inline: true },
            { name: "Gilt für", value: targetField, inline: false },
            { name: "Nachricht", value: feedbackText }
        )
        .setTimestamp()
        .setFooter({ text: `Drippy Feedback System`, iconURL: client.user.displayAvatarURL() });

    const targetChannelId = target === 'streammods' ? KANAL_STREAM_MODS : KANAL_DISCORD_MODS;
    const logChannel = guild.channels.cache.get(targetChannelId);

    if (logChannel) {
        const pingMessage = modId !== "all" ? `⚠️ **Direktes Feedback für:** <@${modId}>` : null;
        await logChannel.send({ 
            content: pingMessage, 
            embeds: [logEmbed] 
        });
    }

    return await interaction.editReply({
        content: `Vielen Dank! Dein Feedback wurde im Profil des Moderators gespeichert.`
    });

} catch (error) {
    console.error("Fehler beim Speichern des Feedbacks:", error);
    return await interaction.editReply({
        content: "Es gab einen Fehler beim Speichern. Bitte versuche es noch einmal."
    });
}
    }
};