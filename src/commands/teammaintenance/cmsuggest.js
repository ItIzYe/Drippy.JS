const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');
const language = require("../../handlers/languages");

module.exports = {
    name: 'setup-vorschlag',
    description: 'Erstellt die Nachricht mit dem Vorschläge-Button auf allen Servern.',
    description_localizations: {
                "en-US": "Creates the message using the suggestions button on all servers."
            },  
    permissionsRequired: [PermissionFlagsBits.ManageGuild],
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
    //deleted: false,

    async callback(client, interaction) {
        // Erste Antwort an den Admin (Nutzt die Guild des ausführenden Servers)
        await interaction.deferReply({
            ephemeral: true 
        });

        const guilds = client.guilds.cache.values();
        let successCount = 0;
        
        for (const guild of guilds) {
            try {
                const config = await GuildConfiguration.findOne({ guildId: guild.id });
                let targetChannel;
    
                // Logik für Kanalauswahl
                if (config?.announcementChannelIds?.length > 0) {
                    targetChannel = await client.channels.fetch(config.announcementChannelIds[0]).catch(() => null);
                } else {
                    targetChannel = guild.systemChannel;
                }
    
                if (targetChannel) {
                    // Embed & Button komplett dynamisch übersetzt für die jeweilige Guild
                    const embed = new EmbedBuilder()
                        .setColor('#5865F2')
                        .setTitle(language(guild, 'LK_SUGGEST_SETUP_TITLE'))
                        .setDescription(language(guild, 'LK_SUGGEST_SETUP_DESC'))
                        .setFooter({ text: language(guild, 'LK_SUGGEST_SETUP_FOOTER') });

                    const button = new ButtonBuilder()
                        .setCustomId('oeffne_vorschlag_modal')
                        .setLabel(language(guild, 'LK_SUGGEST_BUTTON_LABEL'))
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('📥');

                    const row = new ActionRowBuilder().addComponents(button);

                    await targetChannel.send({ embeds: [embed], components: [row] });
                    successCount++;
                }
            } catch (err) {
                console.error(`Fehler in Guild ${guild.id}: ${err.message}`);
            }
        }
    
        // Holt den Erfolgs-String und ersetzt den Platzhalter {count} mit der echten Zahl
        const successMessage = language(interaction.guild, 'LK_SUGGEST_SETUP_SUCCESS')
            .replace('{count}', successCount);

        // Abschlussbericht an den Admin
        await interaction.editReply({ 
            content: successMessage 
        });
    },
};