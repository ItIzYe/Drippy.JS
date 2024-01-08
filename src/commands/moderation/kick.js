const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits, Permissions, MessageEmbed,
} = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a member from this server.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to kick.',
            required: true,
            type: 6,
        },
        {
            name: 'reason',
            description: 'The reason you want to kick.',
            type: 3,
        },
    ],
    permissionsRequired: [Permissions.FLAGS.KICK_MEMBERS],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason =
            interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('KICK')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht kicken da er sich nicht mehr auf dem Server befindet', inline: true}
                )
            await interaction.editReply({embeds: [embed]});
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('KICK')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht kicken da ihm der Server gehört', inline: true}
                )
            await interaction.editReply({embeds: [embed]});
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('KICK')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht kicken da er die selbe/höhere Rolle als du hat', inline: true}
                )
            await interaction.editReply({embeds: [embed]});
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('KICK')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht kicken da er die selbe/höhere Rolle als ich hat', inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        // Kick the targetUser
        try {
            await targetUser.kick({ reason });
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('KICK')
                .setDescription('Ein Member wurde gekickt')
                .setFields(
                    {name: 'Member', value: `${targetUser}`, inline: true},
                    {name: '---------', value: '      ', inline:true},
                    {name: 'Grund', value: `${reason}`, inline: true}
                )
            await interaction.editReply({embeds: [embed]});
        } catch (error) {
            console.log(`There was an error when kicking: ${error}`);
        }
    },
};