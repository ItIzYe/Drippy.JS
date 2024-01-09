const GuildConfiguration = require('../../models/GuildConfiguration');
const ImageConfiguration = require('../../models/Images');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: 'ban',
    description: 'Bans a member from this server.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to ban.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason you want to ban.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason =
            interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('BANN')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht bannen da er nicht mehr auf dem Server ist', inline: true}
                )
            await interaction.editReply({embeds: [embed]});
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
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
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('BANN')
                .setDescription('Ein Fehler liegt vor')
                .setFields(
                    {name: 'Fehler', value:'Ich konnte den Member nicht bannen da er die selbe/höhere Rolle als du hat', inline: true}
                )
            await interaction.editReply({embeds: [embed]});
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
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
            let moderationImage = await ImageConfiguration.findOne({guildId: '865934977270546462'});
            let banImage = moderationImage.moderationImages;
            let random = banImage[Math.floor(Math.random() * banImage.length)];

            let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId});
            if(guildConfiguration.moderationChannelIds) {
                const messageChannel = client.channels.cache.get(guildConfiguration.moderationChannelIds[0])
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('BANN')
                    .setThumbnail(random)
                    .setDescription('Ein User wurde gebannt')
                    .setFields(
                        {name: 'Member', value: `${targetUser}`, inline: true},
                        {name: '---------', value: '      ', inline:true},
                        {name: 'Grund', value: `${reason}`, inline: true}
                    )

                await targetUser.ban({ reason });
                const message = await messageChannel.send({embeds : [embed]});
                console.log(message.embeds[0].image)

                const answerEmbed = new EmbedBuilder()
                    .setTitle('Person wurde gebannt')

                await interaction.editReply({embeds: [answerEmbed]});
            } else if(!guildConfiguration.moderationChannelIds) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setThumbnail(random)
                    .setTitle('BANN')
                    .setDescription('Ein User wurde gebannt')
                    .setFields(
                        {name: 'Member', value: `${targetUser}`, inline: true},
                        {name: '---------', value: '      ', inline:true},
                        {name: 'Grund', value: `${reason}`, inline: true}
                    )

                await targetUser.ban({ reason });
                await interaction.editReply({embeds : [embed]});
            }

        } catch (error) {
            console.log(`There was an error when banning: ${error}`);
        }
    },
};