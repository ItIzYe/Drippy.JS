const GuildConfiguration = require('../../models/GuildConfiguration');
const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const ms = require('ms');

const language = require("../../handlers/languages");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: 'timeout',
    description: 'Timeout a user.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to timeout.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'duration',
            description: 'Timeout duration (30m, 1h, 1 day).',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for the timeout.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
    //testOnly: true,

    callback: async (client, interaction) => {

        const { guild } = interaction

        const mentionable = interaction.options.get('target-user').value;
        const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
        const reason = interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription(`${language(guild, 'TIMEOUT_EMBED_ERROR_TITLE')}`)
                .setFields(
                    {name: `${language(guild, 'BAN_EMBED_ERROR')}`, value: `${language(guild, 'TIMEOUT_EMBED_ERROR_DESCRIPTION1')}`, inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        if (targetUser.user.bot) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription(`${language(guild, 'TIMEOUT_EMBED_ERROR_TITLE')}`)
                .setFields(
                    {name: `${language(guild, 'BAN_EMBED_ERROR')}`, value: `${language(guild, 'TIMEOUT_EMBED_ERROR_DESCRIPTION2')}`, inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription(`${language(guild, 'TIMEOUT_EMBED_ERROR_TITLE')}`)
                .setFields(
                    {name: `${language(guild, 'BAN_EMBED_ERROR')}`, value:`${language(guild, 'TIMEOUT_EMBED_ERROR_DESCRIPTION3')}`, inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription(`${language(guild, 'TIMEOUT_EMBED_ERROR_TITLE')}`)
                .setFields(
                    {name: `${language(guild, 'BAN_EMBED_ERROR')}`, value:`${language(guild, 'TIMEOUT_EMBED_ERROR_DESCRIPTION4')}`, inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT  ')
                .setDescription(`${language(guild, 'TIMEOUT_EMBED_ERROR_TITLE')}`)
                .setFields(
                    {name: `${language(guild, 'BAN_EMBED_ERROR')}`, value: `${language(guild, 'TIMEOUT_EMBED_ERROR_DESCRIPTION5')}`, inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription(`${language(guild, 'TIMEOUT_EMBED_ERROR_TITLE')}`)
                .setFields(
                    {name: `${language(guild, 'BAN_EMBED_ERROR')}`, value: `${language(guild, 'TIMEOUT_EMBED_ERROR_DESCRIPTION6')}`, inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        try {
    const { default: prettyMs } = await import('pretty-ms');

    const guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });

    await targetUser.timeout(msDuration, reason);

    const isAlreadyTimedOut = targetUser.isCommunicationDisabled();
    const statusText = isAlreadyTimedOut 
        ? language(guild, 'TIMEOUT_EMBED_TIMEOUTED_CHANGED') 
        : language(guild, 'TIMEOUT_EMBED_TIMEOUTED');

    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('TIMEOUT')
        .setDescription(statusText)
        .addFields(
            { name: 'Member', value: `${targetUser}`, inline: true },
            { name: `${language(guild, 'TIMEOUT_EMBED_TIMEOUTED_DURATION')}`, value: prettyMs(msDuration, { verbose: true }), inline: true },
            { name: `${language(guild, 'TIMEOUT_EMBED_TIMEOUTED_REASON')}`, value: `${reason}`, inline: true },
        );

    const logChannelId = guildConfiguration?.moderationChannelIds?.[0];
    const logChannel = logChannelId ? client.channels.cache.get(logChannelId) : null;

    if (logChannel) {
        await logChannel.send({ embeds: [embed] });
        
        const answerEmbed = new EmbedBuilder()
            .setTitle(isAlreadyTimedOut 
                ? language(guild, 'TIMEOUT_EMBED_TIMEOUTED_CHANGED') 
                : language(guild, 'TIMEOUT_EMBED_TIMEOUTED_CREATED')
            );
        await interaction.editReply({ embeds: [answerEmbed] });
    } else {
        await interaction.editReply({ embeds: [embed] });
    }

} catch (error) {
    console.log(`There was an error when timing out: ${error}`);
    await interaction.editReply("An error occurred while trying to timeout the user.");
}
    },

};
