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

module.exports = {
    name: 'config-view',
    description: 'Zeigt die aktuelle Konfiguration an und erlaubt Änderungen per Button.',
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            //await interaction.deferReply();
            console.log('Config-View wird ausgegeben')
        } catch (err) {
            console.error("Fehler beim Defer:", err);
            return;
        }

        try {
            const { embed, row1, row2 } = await createConfigDashboard(interaction.guild);

            await interaction.editReply({ 
                embeds: [embed], 
                components: [row1, row2] 
            });
        } catch (error) {
            console.error("Fehler im Config-Callback:", error);
            if (interaction.deferred) {
                await interaction.editReply({ content: '❌ Fehler beim Laden der Konfiguration.' });
            }
        }
    }
};


async function createConfigDashboard(guild) {
    const [config, langData] = await Promise.all([
        GuildConfiguration.findOne({ guildId: guild.id }),
        Language.findOne({ guildId: guild.id })
    ]);

    const rawLang = langData ? langData.language : 'german'; 

const isEnglish = rawLang.toLowerCase() === 'english';

const displayLang = isEnglish ? 'English' : 'Deutsch';
const langEmoji = isEnglish ? '🇺🇸' : '🇩🇪';

    const formatChan = (ids) => (ids && ids.length > 0) ? `<#${ids[0]}>` : '❌ *Nicht gesetzt*';

    const embed = new EmbedBuilder()
        .setTitle(`⚙️ Server-Konfiguration: ${guild.name}`)
        .setDescription('Klicke auf einen Button unten, um den Kanal für die jeweilige Kategorie zu ändern.')
        .setColor(0x5865F2)
        .setThumbnail(guild.iconURL())
        .addFields(
            { name: `${langEmoji} Sprache`, value: `**${displayLang}**`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true }, // Spacer
            { name: '🎫 Tickets', value: formatChan(config?.ticketLogChannelId), inline: true },
            { name: '🛡️ Moderation', value: formatChan(config?.moderationChannelIds), inline: true },
            { name: '💡 Suggestions', value: formatChan(config?.suggestionChannelIds), inline: true },
            { name: '📈 Leveling', value: formatChan(config?.levelChannelIds), inline: true },
            { name: '📢 Announcements', value: formatChan(config?.announcementChannelIds), inline: true }
        )
        .setFooter({ text: 'Drippy Config System', iconURL: guild.client.user.displayAvatarURL() })
        .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('cfg_tickets').setLabel('Tickets').setStyle(ButtonStyle.Secondary).setEmoji('🎫'),
        new ButtonBuilder().setCustomId('cfg_suggestions').setLabel('Suggestions').setStyle(ButtonStyle.Secondary).setEmoji('💡'),
        new ButtonBuilder().setCustomId('cfg_moderation').setLabel('Moderation').setStyle(ButtonStyle.Secondary).setEmoji('🛡️')
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('cfg_levels').setLabel('Leveling').setStyle(ButtonStyle.Secondary).setEmoji('📈'),
        new ButtonBuilder().setCustomId('cfg_announcements').setLabel('Announce').setStyle(ButtonStyle.Secondary).setEmoji('📢'),
        new ButtonBuilder().setCustomId('cfg_close').setLabel('Schließen').setStyle(ButtonStyle.Danger)
    );

    return { embed, row1, row2 };
}

module.exports.createConfigDashboard = createConfigDashboard;