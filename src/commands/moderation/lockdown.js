const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} = require('discord.js');
// const language = require("../../handlers/languages"); // Uncomment if you use your lang handler

module.exports = {
    name: 'lockdown',
    description: 'Manage channel access.',
    options: [
        {
            name: 'lock',
            description: 'Prevents @everyone from sending messages in a channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to lock (leave empty for this channel).',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: false
                },
                {
                    name: 'reason',
                    description: 'The reason for the lockdown.',
                    type: ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        },
        {
            name: 'unlock',
            description: 'Restores sending permissions for @everyone.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to unlock (leave empty for this channel).',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: false
                }
            ]
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ManageChannels],

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const { options, guild, channel } = interaction;
        const subcommand = options.getSubcommand();

        // Get the target channel OR use the current channel
        const targetChannel = options.getChannel('channel') || channel;
        const reason = options.getString('reason') || 'No reason provided';

        await interaction.deferReply();

        // --- SUBCOMMAND: LOCK ---
        if (subcommand === 'lock') {
            // Check if already locked (optional check, but good for UX)
            const currentPerms = targetChannel.permissionsFor(guild.roles.everyone);
            if (!currentPerms.has(PermissionFlagsBits.SendMessages)) {
                return interaction.editReply({
                    content: `🔒 **${targetChannel.name}** is already locked.`
                });
            }

            try {
                // Deny SendMessages for @everyone
                await targetChannel.permissionOverwrites.edit(guild.roles.everyone, {
                    SendMessages: false,
                    AddReactions: false // Optional: Stop reactions too?
                });

                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🔒 Channel Locked')
                    .setDescription(`This channel has been locked by <@${interaction.user.id}>.`)
                    .addFields(
                        { name: 'Channel', value: `<#${targetChannel.id}>`, inline: true },
                        { name: 'Reason', value: reason, inline: true }
                    );

                // Send confirmation in the command channel
                await interaction.editReply({ embeds: [embed] });

                // Optional: Send a message inside the locked channel so people know
                if (targetChannel.id !== channel.id) {
                    const notifyEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('🔒 Lockdown')
                        .setDescription(`This channel is currently under lockdown.\n**Reason:** ${reason}`);
                    await targetChannel.send({ embeds: [notifyEmbed] });
                }

            } catch (error) {
                console.log(error);
                await interaction.editReply({
                    content: "❌ I could not lock the channel. Please check my permissions."
                });
            }
        }

        // --- SUBCOMMAND: UNLOCK ---
        if (subcommand === 'unlock') {
            try {
                // Reset SendMessages to "null" (Inherit) or "true" (Allow)
                // "null" is usually safer as it restores the default server state.
                await targetChannel.permissionOverwrites.edit(guild.roles.everyone, {
                    SendMessages: null,
                    AddReactions: null
                });

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('🔓 Channel Unlocked')
                    .setDescription(`This channel has been unlocked.`)
                    .addFields({ name: 'Channel', value: `<#${targetChannel.id}>`, inline: true });

                await interaction.editReply({ embeds: [embed] });
                
                // Optional: Notify the channel itself
                if (targetChannel.id !== channel.id) {
                    await targetChannel.send('🔓 **The lockdown has been lifted.**');
                }

            } catch (error) {
                console.log(error);
                await interaction.editReply({
                    content: "❌ I could not unlock the channel. Please check my permissions."
                });
            }
        }
    }
};
