const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');

module.exports = async (interaction, heist, mic, time = 60 * 60 * 1000) => {
    try {
        const { member, user } = interaction;
        const voiceChannel = member.voice.channel;

        // Falls noch nicht geschehen (Sicherheitshalber)
        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply();
        }

        const lfgEmbed = new EmbedBuilder()
            .setColor(0x2ecc71) 
            .setTitle('🚗 GTA V - Mitspieler gesucht!')
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .addFields(
                { name: '📌 Aktivität', value: `\`${heist}\``, inline: true },
                { name: '🎙️ Mikrofon', value: `\`${mic}\``, inline: true },
                { 
                    name: '🔊 Sprachkanal', 
                    value: voiceChannel ? `<#${voiceChannel.id}>` : '❌ Nicht im Voice', 
                    inline: true 
                }
            )
            .setFooter({ text: 'Klicke unten, um beizutreten!' })
            .setTimestamp();

        const joinButton = new ButtonBuilder()
            .setCustomId('lfg_join')
            .setLabel('Beitreten / Nachricht')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🎮');

        const row = new ActionRowBuilder().addComponents(joinButton);

        // Nachricht senden/editieren
        const msg = await interaction.editReply({ 
            embeds: [lfgEmbed], 
            components: [row], 
            fetchReply: true 
        });

        // Collector erstellen (wie in deiner Pagination)
        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time,
        });

        collector.on('collect', async i => {
            // Nur der Ersteller darf NICHT klicken
            if (i.user.id === user.id) {
                return await i.reply({ content: "Du hast die Suche gestartet!", flags :[MessageFlags.Ephemeral] });
            }

            if (i.customId === 'lfg_join') {
                if (voiceChannel) {
                    await i.reply({ 
                        content: `Tritt hier dem Voice bei: <#${voiceChannel.id}>`, 
                        flags :[MessageFlags.Ephemeral] 
                    });
                } else {
                    try {
                        await user.send(`🔔 **GTA LFG:** **${i.user.tag}** möchte deinem Heist beitreten!`);
                        await i.reply({ content: `Ich habe **${user.username}** benachrichtigt!`, flags :[MessageFlags.Ephemeral] });
                    } catch (err) {
                        await i.reply({ content: "Konnte keine DM senden.", flags :[MessageFlags.Ephemeral] });
                    }
                }
            }
        });

        collector.on('end', async () => {
            const disabledRow = new ActionRowBuilder().addComponents(
                ButtonBuilder.from(joinButton).setDisabled(true).setLabel('Suche beendet')
            );
            await msg.edit({ components: [disabledRow] }).catch(() => {});
        });

        return interaction;
    } catch (e) {
        console.log(`[LFG-UTIL-ERROR] ${e}`);
    }
};