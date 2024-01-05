const {
    Client,
    Interaction,
    Permissions,
    MessageEmbed,

    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ApplicationCommand,
    ApplicationCommandPermissionsManager
} = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a member from this server.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to ban.',
            required: true,
            type: 6,
        },
        {
            name: 'reason',
            description: 'The reason you want to ban.',
            type: 3,
        },
    ],
    permissionsRequired: [Permissions.FLAGS.BAN_MEMBERS],

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
                .setTitle('BANN')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht bannen da er nicht mehr auf dem Server ist', inline: true}
                )
            await interaction.editReply({embeds: [embed]});
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {const embed = new MessageEmbed()
            .setColor('YELLOW')
            .setTitle('BANN')
            .setDescription('Ein Fehler liegt vor')
            .setFields(
                {name: 'Fehler', value:'Ich konnte den Member nicht bannen da er der Server Owner ist', inline: true}
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
                .setTitle('BANN')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht bannen da er die selbe/höhere Rolle als du hat', inline: true}
                )
            await interaction.editReply({embeds: [embed]});
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('BANN')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht bannen da er die selbe/höhere Rolle als ich hat', inline: true}
                )

            await interaction.editReply({embeds: [embed]});
            return;
        }

        // Ban the targetUser
        try {

            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle('BANN')
                .setDescription('Ein User wurde gebannt')
                .setFields(
                    {name: 'Member', value: `${targetUser}`, inline: true},
                    {name: '---------', value: '      ', inline:true},
                    {name: 'Grund', value: `${reason}`, inline: true}
                )

            await targetUser.ban({ reason });
            await interaction.editReply({embeds : [embed]});
        } catch (error) {
            console.log(`There was an error when banning: ${error}`);
        }
    },

};
