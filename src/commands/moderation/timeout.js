const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
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

    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('target-user').value;
        const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
        const reason = interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht timeouten da er sich nicht mehr auf dem Server befindet', inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        if (targetUser.user.bot) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich kann keine Bots timeouten', inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Eine Timeout-Dauer muss festgelegt sein', inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Die Timeout-Dauer muss zwischen 5 Sekunden und 28 Tagen sein', inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT  ')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht timeouten da er die gleiche/höhere Rolle hat als du', inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('TIMEOUT')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht timeouten da er die gleiche/höhere Rolle hat als ich', inline: true}
                )
            await interaction.editReply({embeds:[embed]});
            return;
        }

        // Timeout the user
        try {
            const { default: prettyMs } = await import('pretty-ms');

            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('TIMEOUT')
                    .setDescription('Ein Timeout wurde geändert')
                    .setFields(
                        {name: 'Member', value: `${targetUser}`, inline: true},
                        {name: 'Neuer Timeout', value:prettyMs(msDuration, {verbose:true}), inline:true},
                        {name: 'Grund', value: `${reason}`, inline: true}
                    )
                await interaction.editReply({embeds: [embed]});
                return;
            }

            await targetUser.timeout(msDuration, reason);
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('TIMEOUT')
                .setDescription('Ein Member wurde getimeoutet')
                .setFields(
                    {name: 'Member', value: `${targetUser}`, inline: true},
                    {name: 'Dauer', value: prettyMs(msDuration), inline:true},
                    {name: 'Grund', value: `${reason}`, inline: true}
                )
            await interaction.editReply({embeds: [embed]});
        } catch (error) {
            console.log(`There was an error when timing out: ${error}`);
        }
    },

};