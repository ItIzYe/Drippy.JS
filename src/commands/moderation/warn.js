const WarnModel = require('../../models/Warns');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');
const language = require("../../handlers/languages");


function generateCaseId() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

module.exports = {
    name: 'warn',
    description: 'Manage user warnings (Reference System)',
    options: [
        {
            name: 'add',
            description: 'Issue a warning to a user',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'target-user',
                    description: 'The user to warn',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'The reason for the warning',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'list',
            description: 'View warnings for a user',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'target-user',
                    description: 'The user to check (defaults to yourself)',
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a specific warning using its Case ID',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'case-id',
                    description: 'The unique Case ID (e.g., A7X2)',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    //testOnly: true,

    callback: async (client, interaction) => {
        const { options, guild, member } = interaction;
        const subcommand = options.getSubcommand();

        await interaction.deferReply();


        if (subcommand === 'add') {
            if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
                return interaction.editReply({ 
                    content: "You do not have permission to warn users." 
                });
            }

            const targetUser = options.getUser('target-user');
            const reason = options.getString('reason');
            const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);

  
            if (targetMember) {
                const targetUserRolePosition = targetMember.roles.highest.position;
                const requestUserRolePosition = member.roles.highest.position;
                const botRolePosition = guild.members.me.roles.highest.position;

                if (targetUserRolePosition >= requestUserRolePosition) {
                    return interaction.editReply({ content: "You cannot warn a member with a higher or equal role." });
                }
                if (targetUserRolePosition >= botRolePosition) {
                    return interaction.editReply({ content: "I cannot warn this member because their role is higher than mine." });
                }
            }


            const caseId = generateCaseId();


            const newWarn = new WarnModel({
                guildId: guild.id,
                userId: targetUser.id,
                moderatorId: member.id,
                reason: reason,
                caseId: caseId
            });

            await newWarn.save();


            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('WARN ADDED' || `Warning Issued: Case #${caseId}`)
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: 'User', value: `${targetUser}`, inline: true },
                    { name: 'Moderator', value: `${member}`, inline: true },
                    { name: `${language(guild, 'BAN_EMBED_BANNED_REASON')}`, value: reason, inline: false },
                    { name: 'Case ID', value: `\`${caseId}\``, inline: true } 
                )
                .setFooter({ text: "Use /warn remove [case-id] to delete this." });

            const embed_user = new EmbedBuilder()
                .setColor('Red')
                .setTitle('WARN ADDED' || `Warning Issued: Case #${caseId}`)
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: 'User', value: `${targetUser}`, inline: true },
                    { name: `${language(guild, 'BAN_EMBED_BANNED_REASON')}`, value: reason, inline: false },
                    { name: 'Case ID', value: `\`${caseId}\``, inline: true }
                )


            await targetMember.send({ embeds: [embed_user] });
            return interaction.editReply({ embeds: [embed] });
        }


        if (subcommand === 'list') {
            const targetUser = options.getUser('target-user') || interaction.user;


            const warns = await WarnModel.find({ 
                guildId: guild.id, 
                userId: targetUser.id 
            }).sort({ timestamp: 1 });

            if (!warns.length) {
                return interaction.editReply({ 
                    content: `${targetUser} has no warnings on record.` 
                });
            }


            const embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle(`Warnings for ${targetUser.username}`)
                .setDescription(`Found **${warns.length}** warning(s).`)
                .setThumbnail(targetUser.displayAvatarURL());


            const recentWarns = warns.slice(-25);

            recentWarns.forEach(warn => {
                embed.addFields({
                    name: `Case ID: ${warn.caseId} | <t:${Math.floor(warn.timestamp / 1000)}:d>`,
                    value: `**Mod:** <@${warn.moderatorId}>\n**${language(guild, 'BAN_EMBED_BANNED_REASON')}:** ${warn.reason}`
                });
            });

            return interaction.editReply({ embeds: [embed] });
        }


        if (subcommand === 'remove') {
            if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
                return interaction.editReply({ 
                    content: "You do not have permission to remove warnings." 
                });
            }

            const caseId = options.getString('case-id');

            const deletedWarn = await WarnModel.findOneAndDelete({ 
                guildId: guild.id, 
                caseId: caseId 
            });

            if (!deletedWarn) {
                return interaction.editReply({ 
                    content: `❌ Could not find a warning with Case ID: \`${caseId}\`` 
                });
            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle("Warning Removed")
                .setDescription(`Successfully deleted Case **#${caseId}** from <@${deletedWarn.userId}>.`)
                .addFields({ name: 'Original Reason', value: deletedWarn.reason });

            return interaction.editReply({ embeds: [embed] });
        }
    }
};
