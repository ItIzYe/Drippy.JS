const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require('discord.js');
const AutomodConfig = require('../../models/Automod');
const language = require("../../handlers/languages");

module.exports = {
    name: 'automod-config',
    description: 'Öffnet das AutoMod Dashboard.',
    permissionsRequired: [PermissionFlagsBits.ManageGuild],
    botPermissions: [PermissionFlagsBits.ManageMessages],
    //deleted: true,

    callback: async (client, interaction) => {
        const { guild } = interaction;
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        try {
            let config = await AutomodConfig.findOne({ guildId: guild.id });
            if (!config) config = await AutomodConfig.create({ guildId: guild.id });

            const embed = new EmbedBuilder()
                .setColor('#8BBEEF')
                .setTitle(`🛡️ ${language(guild, 'AUTOMOD_DASHBOARD_TITLE') || 'AutoMod Dashboard'}`)
                .setDescription(language(guild, 'AUTOMOD_DASHBOARD_DESC') || 'Verwalte die Filter- und Schutzsysteme deines Servers.')
                .setFields(
                    { name: 'Status', value: config.enabled ? '🟢 Aktiv' : '🔴 Deaktiviert', inline: true },
                    { name: 'Verbotene Wörter', value: `\`${config.customBannedWords?.length || 0}\``, inline: true },
                    { name: 'Erlaubte Wörter (Whitelist)', value: `\`${config.whitelistedWords?.length || 0}\``, inline: true },
                    { name: 'Kanäle', value: `\`${config.ignoredChannels?.length || 0}\` ignoriert`, inline: false }
                );

            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('automod_toggle')
                    .setLabel(config.enabled ? 'Deaktivieren' : 'Aktivieren')
                    .setStyle(config.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('automod_add_word')
                    .setLabel('Wort verbieten')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('automod_whitelist_word')
                    .setLabel('Whitelist')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🏳️'),
                new ButtonBuilder()
                    .setCustomId('automod_channel_config_start')
                    .setLabel('Kanäle')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⚙️')
            );

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('automod_show_words')
                    .setLabel('Blacklist zeigen')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('automod_show_whitelist')
                    .setLabel('Whitelist zeigen')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋'),
                new ButtonBuilder()
                    .setCustomId('automod_list_channels')
                    .setLabel('Kanäle anzeigen')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋')
            );

            await interaction.editReply({ embeds: [embed], components: [row1, row2] });

        } catch (error) {
            console.log(`AutoMod Dashboard Error: ${error}`);
        }
    },
};