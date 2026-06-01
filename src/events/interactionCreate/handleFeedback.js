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
    StringSelectMenuOptionBuilder,
    MessageFlags
} = require('discord.js');
const Feedback = require('../../models/Feedback');

const KANAL_STREAM_MODS = "1510991200209997946"; 
const KANAL_DISCORD_MODS = "1510991200209997946"; 

// ==========================================
// DIE TEAM-LISTE (Hier trägst du die Mods ein)
// ==========================================
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


module.exports = async (client, interaction) => {
    
    /**
     * 1. SCHRITT: KATEGORIE GEWÄHLT (Aus dem permanenten Embed)
     */
    if (interaction.isStringSelectMenu() && interaction.customId === 'feedback_target_select') {
        const target = interaction.values[0]; 
        const ausgewaehlteMods = TEAM_LISTE[target];

        if (!ausgewaehlteMods || ausgewaehlteMods.length === 0) {
            return await interaction.reply({ content: "Keine Moderatoren für diese Kategorie gefunden.", flags: [MessageFlags.Ephemeral] });
        }

        const stringSelect = new StringSelectMenuBuilder()
            .setCustomId(`feedback_user_select_${target}`)
            .setPlaceholder('Wähle den Moderator aus...');

        ausgewaehlteMods.forEach(mod => {
            stringSelect.addOptions(
                new StringSelectMenuOptionBuilder().setLabel(mod.label).setValue(mod.value)
            );
        });

        const allButton = new ButtonBuilder()
            .setCustomId(`feedback_user_all_${target}`)
            .setLabel('Gilt dem gesamten Team')
            .setStyle(ButtonStyle.Secondary);

        const row1 = new ActionRowBuilder().addComponents(stringSelect);
        const row2 = new ActionRowBuilder().addComponents(allButton);

        return await interaction.reply({
            content: `Du hast **${target === 'streammods' ? 'Stream-Mods' : 'Discord-Mods'}** gewählt. Wer soll das Feedback erhalten?`,
            components: [row1, row2],
            flags: [MessageFlags.Ephemeral]
        });
    }

    /**
     * 2. SCHRITT: MODERATOR ODER "ALLE" GEWÄHLT
     */
    const isModSelect = interaction.isStringSelectMenu() && interaction.customId.startsWith('feedback_user_select_');
    const isAllButton = interaction.isButton() && interaction.customId.startsWith('feedback_user_all_');

    if (isModSelect || isAllButton) {
        await interaction.deferUpdate(); 

        const target = interaction.customId.split('_')[3];
        const modId = isModSelect ? interaction.values[0] : "all";

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
        
        return await interaction.editReply({
            content: `Feedback für: ${targetName}\nWie viele Sterne möchtest du geben?`,
            components: [row]
        });
    }

    /**
     * 3. SCHRITT: STERNE GEKLICKT -> MODAL ÖFFNEN
     */
    if (interaction.isButton() && interaction.customId.startsWith('feedback_stars_')) {
        const [,, target, modId, stars] = interaction.customId.split('_');

        const modal = new ModalBuilder()
            .setCustomId(`feedback_modal_${target}_${modId}_${stars}`)
            .setTitle('Feedback schreiben');

        const textInput = new TextInputBuilder()
            .setCustomId('feedback_text')
            .setLabel('Dein Feedback (optional):')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Schreibe hier deine Nachricht...')
            .setRequired(false)
            .setMaxLength(1000);

        const anonymInput = new TextInputBuilder()
            .setCustomId('feedback_anonym')
            .setLabel('Anonym absenden? (Schreibe "ja")')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('ja / nein')
            .setRequired(false)
            .setMaxLength(4);

        modal.addComponents(
            new ActionRowBuilder().addComponents(textInput),
            new ActionRowBuilder().addComponents(anonymInput)
        );

        await interaction.showModal(modal);
        
        return await interaction.editReply({
            content: `Das Feedback-Fenster ist nun offen.`,
            components: []
        }).catch(() => null);
    }

    /**
     * 4. SCHRITT: MODAL ABSENDEN (Speichern & Loggen)
     */
    if (interaction.isModalSubmit() && interaction.customId.startsWith('feedback_modal_')) {
        const [,, target, modId, stars] = interaction.customId.split('_');
        const feedbackText = interaction.fields.getTextInputValue('feedback_text').trim() || "*Kein Text-Feedback abgegeben.*";
        const anonymText = interaction.fields.getTextInputValue('feedback_anonym').toLowerCase().trim();
        const isAnonym = anonymText === 'ja' || anonymText === 'j';
        
        const { guild, user } = interaction;
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        try {
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

            const starEmojis = "⭐".repeat(parseInt(stars));
            const userField = isAnonym ? "🕵️ Anonymes Mitglied" : `${user.tag} (${user.id})`;
            const targetField = modId === "all" ? "Gesamtes Team" : `<@${modId}>`;

            const logEmbed = new EmbedBuilder()
                .setColor(target === 'streammods' ? 0x3498db : 0x9b59b6)
                .setTitle(`Neues Feedback: ${target === 'streammods' ? '📺 Stream-Team' : '🛡️ Discord-Team'}`)
                .addFields(
                    { name: "Eingereicht von", value: userField, inline: true },
                    { name: "Bewertung", value: `${starEmojis} (${stars}/5)`, inline: true },
                    { name: "Gilt für", value: targetField, inline: false },
                    { name: "Nachricht", value: feedbackText }
                )
                .setTimestamp();

            const targetChannelId = target === 'streammods' ? KANAL_STREAM_MODS : KANAL_DISCORD_MODS;
            
            let logChannel = guild.channels.cache.get(targetChannelId);
            if (!logChannel) {
                try {
                    logChannel = await guild.channels.fetch(targetChannelId);
                } catch (fError) {
                    console.error(`[Feedback-Fehler] Kanal mit ID ${targetChannelId} konnte nicht von Discord abgerufen werden:`, fError);
                }
            }

            if (logChannel) {
                const pingContent = (modId !== "all") ? `⚠️ **Direktes Feedback für:** <@${modId}>` : null;
                
                await logChannel.send({ content: pingContent, embeds: [logEmbed] });
                console.log(`✅ Embed erfolgreich in Kanal ${logChannel.name} gesendet.`);
            } else {
                console.error(`❌ FEHLER: Kanal ID ${targetChannelId} existiert nicht auf diesem Server oder der Bot hat keine Rechte!`);
                return await interaction.editReply({ content: "❌ Das Feedback wurde gespeichert, aber der Log-Kanal wurde nicht gefunden." });
            }

            return await interaction.editReply({ content: `✅ Vielen Dank! Dein Feedback (${stars} ⭐) wurde erfolgreich gespeichert.` });

        } catch (error) {
            console.error("Feedback Fehler:", error);
            return await interaction.editReply({ content: "❌ Fehler beim Verarbeiten des Feedbacks." });
        }
    }
};
