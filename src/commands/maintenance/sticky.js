const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, Client, Interaction } = require('discord.js');
const language = require("../../handlers/languages");
const StickyMessage = require('../../models/StickyMessage');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "sticky",
    description: "Manage sticky messages in this channel",
    options: [
        {
            name: 'text',
            description: 'The text for the sticky message (Leave empty to remove the sticky message)',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'interval',
            description: 'Send after how many messages? (e.g. 10 or 27. Default is 1)',
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],

    callback: async (client, interaction) => {
        const { guild, channelId } = interaction;
        const textInput = interaction.options.getString('text');
        const intervalInput = interaction.options.getInteger('interval') || 1;

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: `❌ **${language(guild, 'NO_PERMS') || 'Du hast keine Rechte für diesen Befehl.'}**`,
                ephemeral: true
            });
        }

        if (intervalInput < 1) {
            return interaction.reply({
                content: '❌ Das Intervall muss mindestens `1` sein!',
                ephemeral: true
            });
        }

        if (!textInput) {
            const deleted = await StickyMessage.findOneAndDelete({ guildId: guild.id, channelId: channelId });
            
            if (deleted) {
                if (deleted.lastMessageId) {
                    const channel = await guild.channels.fetch(channelId).catch(() => null);
                    if (channel) {
                        await channel.messages.delete(deleted.lastMessageId).catch(() => {});
                    }
                }
                return interaction.reply({
                    content: `🗑️ **${language(guild, 'STICKY_REMOVED') || 'Die Sticky Message für diesen Kanal wurde gelöscht.'}**`,
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: `❌ **${language(guild, 'STICKY_NOT_FOUND') || 'Es gibt keine aktive Sticky Message in diesem Kanal.'}**`,
                    ephemeral: true
                });
            }
        }

        await interaction.deferReply({ ephemeral: true });

        let stickyData = await StickyMessage.findOne({ guildId: guild.id, channelId: channelId });

        if (stickyData) {
            if (stickyData.lastMessageId) {
                const channel = await guild.channels.fetch(channelId).catch(() => null);
                if (channel) {
                    await channel.messages.delete(stickyData.lastMessageId).catch(() => {});
                }
            }
            stickyData.messageText = textInput;
            stickyData.maxMessages = intervalInput;
            stickyData.messageCount = 0;
            stickyData.lastMessageId = null;
        } else {
            stickyData = new StickyMessage({
                guildId: guild.id,
                channelId: channelId,
                messageText: textInput,
                maxMessages: intervalInput,
                messageCount: 0
            });
        }

        // Erste Nachricht direkt senden
        const embed = new EmbedBuilder()
            .setColor('#8BBEEF')
            .setDescription(`📌 **📌 ${language(guild, 'STICKY_NOTE') || 'Wichtige Information:'}**\n\n${textInput}`)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} Sticky System` });

        const stickyMsg = await interaction.channel.send({ embeds: [embed] });
        stickyData.lastMessageId = stickyMsg.id;
        
        await stickyData.save();

        await interaction.editReply({
            content: `✅ **${language(guild, 'STICKY_SUCCESS') || 'Sticky Message erfolgreich eingerichtet!'}** (Intervall: Alle \`${intervalInput}\` Nachrichten)`
        });
    }
}