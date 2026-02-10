const WarnModel = require('../../models/Warns');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');
const language = require("../../handlers/languages");

// Simple function to generate a random Case ID (e.g., "A7X2")
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

    callback: async (client, interaction) => {
        const { options, guild, member } = interaction;
        const subcommand = options.getSubcommand();

        await interaction.deferReply();

        // --- SUBCOMMAND: ADD ---
        if (subcommand === 'add') {
            // Permission Check
            if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
                return interaction.editReply({ 
                    content: "You do not have permission to warn users." 
                });
            }

            const targetUser = options.getUser('target-user');
            const reason = options.getString('reason');
            const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);

            // Hierarchy Check (Prevent warning admins/owners)
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

            // 1. Generate unique Case ID
            const caseId = generateCaseId();

            // 2. Create the "File" in the Database (Reference Method)
            const newWarn = new WarnModel({
                guildId: guild.id,
                userId: targetUser.id,
                moderatorId: member.id,
                reason: reason,
                caseId: caseId
            });

            await newWarn.save();

            // 3. Reply
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('WARN ADDED' || `Warning Issued: Case #${caseId}`)
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: 'User', value: `${targetUser}`, inline: true },
                    { name: 'Moderator', value: `${member}`, inline: true },
                    { name: 'Reason', value: reason, inline: false },
                    { name: 'Case ID', value: `\`${caseId}\``, inline: true } 
                )
                .setFooter({ text: "Use /warn remove [case-id] to delete this." });

            return interaction.editReply({ embeds: [embed] });
        }

        // --- SUBCOMMAND: LIST ---
        if (subcommand === 'list') {
            const targetUser = options.getUser('target-user') || interaction.user;

            // 1. Find all "files" that belong to this user
            // We sort by timestamp so newest are at the bottom
            const warns = await WarnModel.find({ 
                guildId: guild.id, 
                userId: targetUser.id 
            }).sort({ timestamp: 1 });

            if (!warns.length) {
                return interaction.editReply({ 
                    content: `${targetUser} has no warnings on record.` 
                });
            }

            // 2. Format the list
            const embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle(`Warnings for ${targetUser.username}`)
                .setDescription(`Found **${warns.length}** warning(s).`)
                .setThumbnail(targetUser.displayAvatarURL());

            // Limit to last 25 fields (Discord Embed Limit)
            const recentWarns = warns.slice(-25);

            recentWarns.forEach(warn => {
                embed.addFields({
                    name: `Case ID: ${warn.caseId} | <t:${Math.floor(warn.timestamp / 1000)}:d>`,
                    value: `**Mod:** <@${warn.moderatorId}>\n**Reason:** ${warn.reason}`
                });
            });

            return interaction.editReply({ embeds: [embed] });
        }

        // --- SUBCOMMAND: REMOVE ---
        if (subcommand === 'remove') {
            // Permission Check
            if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
                return interaction.editReply({ 
                    content: "You do not have permission to remove warnings." 
                });
            }

            const caseId = options.getString('case-id');

            // 1. Find and Delete the specific "file" by Case ID
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
