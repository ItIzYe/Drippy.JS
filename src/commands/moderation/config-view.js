const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionFlagsBits,
    ChannelSelectMenuBuilder,
    ComponentType 
} = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');
const Language = require('../../models/LanguageSchema');
const language = require("../../handlers/languages");
const { description_localizations } = require('./setup-captcha-eu');

module.exports = {
    name: 'config-view',
    description: 'Zeigt die aktuelle Konfiguration an und erlaubt Änderungen per Button.',
    description_localizations: {
        "en-US": "Displays the current configuration and allows changes via a button."
    },
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            console.log('Config-View wird ausgegeben')
        } catch (err) {
            console.error("Fehler beim Defer:", err);
            return;
        }

        try {
            const { embed, row1, row2, row3 } = await createConfigDashboard(interaction.guild);

            await interaction.editReply({ 
                embeds: [embed], 
                components: [row1, row2, row3 ]
            });
        } catch (error) {
            console.error("Fehler im Config-Callback:", error);
            if (interaction.deferred) {
                await interaction.editReply({ content: '❌ Fehler beim Laden der Konfiguration.' });
            }
        }
    }
};


async function createConfigDashboard(guild, forcedLang = null) {
    const [config, langData] = await Promise.all([
        GuildConfiguration.findOne({ guildId: guild.id }),
        forcedLang ? null : Language.findOne({ _id: guild.id })
    ]);

    // Wenn forcedLang mitgegeben wurde, nutzen wir das direkt, ansonsten die DB
    const rawLang = forcedLang ? forcedLang : (langData ? langData.language : 'german'); 
    const isEnglish = rawLang.toLowerCase() === 'english';

    const displayLang = isEnglish ? 'English' : 'Deutsch';
    const langEmoji = isEnglish ? '🇺🇸' : '🇩🇪';
    
    const nextLangLabel = isEnglish ? 'Auf Deutsch wechseln' : 'Switch to English';
    const nextLangEmoji = isEnglish ? '🇩🇪' : '🇺🇸';

    // Labels für die anderen Buttons dynamisch anpassen
    const labels = {
        tickets: isEnglish ? 'Tickets' : 'Tickets',
        suggestions: isEnglish ? 'Suggestions' : 'Vorschläge',
        moderation: isEnglish ? 'Moderation' : 'Moderation',
        leveling: isEnglish ? 'Leveling' : 'Level-System',
        announce: isEnglish ? 'Announce' : 'Ankündigungen',
        close: isEnglish ? 'Close' : 'Schließen'
    };

    const formatChan = (ids) => (ids && ids.length > 0) ? `<#${ids[0]}>` : '❌ *Nicht gesetzt*';

    // WICHTIG: Damit deine language() Funktion den erzwungenen Wert kennt, 
    // übergeben wir, falls deine Sprachfunktion das unterstützt, temporär ein modifiziertes Guild-Objekt 
    // oder verlassen uns darauf, dass wir das Embed manuell lokalisieren, falls 'language()' stur cached.
    
    const embed = new EmbedBuilder()
        .setTitle(`${language(guild, 'CONFIG_TITLE')} ${guild.name}`)
        .setDescription(`${language(guild, 'CONFIG_DESC')}`)
        .setColor(0x5865F2)
        .setThumbnail(guild.iconURL())
        .addFields(
            { name: `${langEmoji} ${language(guild, 'CONFIG_L')}`, value: `**${displayLang}**`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true }, 
            { name: isEnglish ? '🎫 Tickets' : '🎫 Tickets', value: formatChan(config?.ticketLogChannelId), inline: true },
            { name: isEnglish ? '🛡️ Moderation' : '🛡️ Moderation', value: formatChan(config?.moderationChannelIds), inline: true },
            { name: isEnglish ? '💡 Suggestions' : '💡 Vorschläge', value: formatChan(config?.suggestionChannelIds), inline: true },
            { name: isEnglish ? '📈 Leveling' : '📈 Level-System', value: formatChan(config?.levelChannelIds), inline: true },
            { name: isEnglish ? '📢 Announcements' : '📢 Ankündigungen', value: formatChan(config?.announcementChannelIds), inline: true }
        )
        .setFooter({ text: 'Drippy Config System', iconURL: guild.client.user.displayAvatarURL() })
        .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('cfg_tickets').setLabel(labels.tickets).setStyle(ButtonStyle.Secondary).setEmoji('🎫'),
        new ButtonBuilder().setCustomId('cfg_suggestions').setLabel(labels.suggestions).setStyle(ButtonStyle.Secondary).setEmoji('💡'),
        new ButtonBuilder().setCustomId('cfg_moderation').setLabel(labels.moderation).setStyle(ButtonStyle.Secondary).setEmoji('🛡️')
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('cfg_levels').setLabel(labels.leveling).setStyle(ButtonStyle.Secondary).setEmoji('📈'),
        new ButtonBuilder().setCustomId('cfg_announcements').setLabel(labels.announce).setStyle(ButtonStyle.Secondary).setEmoji('📢'),
        new ButtonBuilder().setCustomId('cfg_toggle_lang').setLabel(nextLangLabel).setStyle(ButtonStyle.Primary).setEmoji(nextLangEmoji)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('cfg_close').setLabel(labels.close).setStyle(ButtonStyle.Danger)
    );

    return { embed, row1, row2, row3 };
}

module.exports.createConfigDashboard = createConfigDashboard;