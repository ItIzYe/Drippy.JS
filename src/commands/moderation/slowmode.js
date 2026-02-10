const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'slowmode',
    description: 'Sets the chat delay for a channel.',
    options: [
        {
            name: 'duration',
            description: 'Time (e.g. 5s, 10m, 1h). Set to "0" or "off" to disable.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'The channel to modify (defaults to current channel).',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: false
        },
        {
            name: 'reason',
            description: 'Reason for the slowmode change.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ManageChannels],

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const { options, channel } = interaction;
        
        // 1. Get Options
        const rawTime = options.getString('duration').toLowerCase();
        const targetChannel = options.getChannel('channel') || channel;
        const reason = options.getString('reason') || 'No reason provided';

        // 2. Parse the time input (e.g., "5m" -> 300 seconds)
        let seconds = 0;

        if (rawTime === 'off' || rawTime === '0') {
            seconds = 0;
        } else if (rawTime.endsWith('s')) {
            seconds = parseInt(rawTime);
        } else if (rawTime.endsWith('m')) {
            seconds = parseInt(rawTime) * 60;
        } else if (rawTime.endsWith('h')) {
            seconds = parseInt(rawTime) * 3600;
        } else {
            // If they just typed a number without a letter, assume seconds
            seconds = parseInt(rawTime);
        }

        // 3. Validation
        if (isNaN(seconds)) {
            return interaction.reply({
                content: '❌ Invalid time format. Please use `10s`, `5m`, `2h`, or `0`.',
                ephemeral: true
            });
        }

        // Discord Limit: Max slowmode is 6 hours (21600 seconds)
        if (seconds > 21600) {
            return interaction.reply({
                content: '❌ You cannot set slowmode higher than 6 hours.',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            // 4. Apply the Slowmode
            await targetChannel.setRateLimitPerUser(seconds, reason);

            // 5. Create Response Embed
            const embed = new EmbedBuilder()
                .setColor(seconds === 0 ? 'Green' : 'Orange')
                .setTitle(seconds === 0 ? '🐇 Slowmode Disabled' : '🐢 Slowmode Enabled')
                .setDescription(
                    seconds === 0
                        ? `The slowmode in ${targetChannel} has been turned off.`
                        : `Set slowmode for ${targetChannel} to **${rawTime}** (${seconds}s).`
                )
                .addFields({ name: 'Reason', value: reason });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: "❌ I couldn't set the slowmode. Check my permissions."
            });
        }
    }
};
