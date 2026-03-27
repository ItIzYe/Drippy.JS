const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    MessageFlags
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
    //testOnly: true,

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const { options, channel } = interaction;
        

        const rawTime = options.getString('duration').toLowerCase();
        const targetChannel = options.getChannel('channel') || channel;
        const reason = options.getString('reason') || 'No reason provided';


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
            seconds = parseInt(rawTime);
        }


        if (isNaN(seconds)) {
            return interaction.reply({
                content: '❌ Invalid time format. Please use `10s`, `5m`, `2h`, or `0`.',
                flags: [MessageFlags.Ephemeral]
            });
        }


        if (seconds > 21600) {
            return interaction.reply({
                content: '❌ You cannot set slowmode higher than 6 hours.',
                flags: [MessageFlags.Ephemeral]
            });
        }

        await interaction.deferReply();

        try {
            await targetChannel.setRateLimitPerUser(seconds, reason);

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
