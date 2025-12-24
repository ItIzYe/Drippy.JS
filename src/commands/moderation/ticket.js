const {
    MessageFlags,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ChannelType,
} = require('discord.js');

const Ticket = require('../../models/ticketSchema');

module.exports = {
    name: 'ticket',
    description: 'Ticket system',

    options: [
        {
            name: 'setup',
            description: 'Setup the ticket system',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'category',
                    description: 'Ticket category',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channelTypes: [ChannelType.GuildCategory],
                },
                {
                    name: 'log-channel',
                    description: 'Log channel',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channelTypes: [ChannelType.GuildText],
                },
            ],
        },
        {
            name: 'create',
            description: 'Create a ticket',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'reason',
                    description: 'Reason for the ticket',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'close',
            description: 'Close the current ticket',
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],

    botPermissions: [
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageRoles,
    ],

    callback: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();

        /* ================= SETUP ================= */
        if (subcommand === 'setup') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({
                    content: 'Administrator permissions required.',
                    flags: MessageFlags.Ephemeral,
                });
            }

            const category = interaction.options.getChannel('category');
            const logChannel = interaction.options.getChannel('log-channel');

            await Ticket.findOneAndUpdate(
                { Guild: interaction.guild.id },
                {
                    Guild: interaction.guild.id,
                    Category: category.id,
                    LogChannel: logChannel.id,
                },
                { upsert: true }
            );

            return interaction.reply({
                content: `Ticket system configured.\nCategory: ${category}\nLogs: ${logChannel}`,
                flags: MessageFlags.Ephemeral,
            });
        }

        /* ================= CREATE ================= */
        if (subcommand === 'create') {
            const data = await Ticket.findOne({ Guild: interaction.guild.id });
            if (!data) {
                return interaction.reply({
                    content: 'Ticket system is not set up.',
                    flags: MessageFlags.Ephemeral,
                });
            }

            const reason = interaction.options.getString('reason');

            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: data.Category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                    },
                ],
            });

            data.Tickets.push({
                ChannelId: channel.id,
                OwnerId: interaction.user.id,
                Reason: reason,
            });

            await data.save();

            await channel.send({
                content: `Ticket by ${interaction.user}\nReason: **${reason}**`,
            });

            return interaction.reply({
                content: `Ticket created: ${channel}`,
                flags: MessageFlags.Ephemeral,
            });
        }

        /* ================= CLOSE ================= */
        if (subcommand === 'close') {
            const data = await Ticket.findOne({ Guild: interaction.guild.id });
            if (!data) return;

            const ticket = data.Tickets.find(
                t => t.ChannelId === interaction.channel.id && !t.Closed
            );

            if (!ticket) {
                return interaction.reply({
                    content: 'This is not an active ticket.',
                    flags: MessageFlags.Ephemeral,
                });
            }

            ticket.Closed = true;
            await data.save();

            await interaction.reply('Ticket closed.');
            await interaction.channel.delete();
        }
    },
};
