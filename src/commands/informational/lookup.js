const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, Client, Interaction } = require('discord.js');
const language = require("../../handlers/languages");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "lookup",
    description: "Find out what entity belongs to a specific Discord ID",
    options: [
        {
            name: 'id',
            description: 'The ID (Snowflake) you want to inspect',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    callback: async (client, interaction) => {
        const { guild } = interaction;
        const targetId = interaction.options.getString('id').trim();

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: `❌ **${language(guild, 'NO_PERMS') || 'Du hast keine Rechte für diesen Befehl.'}**`,
                ephemeral: true
            });
        }

        if (!/^\d{17,20}$/.test(targetId)) {
            return interaction.reply({
                content: `❌ **${language(guild, 'LK_INVALID_ID')}**`,
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        // 1. KANAL-LOOKUP
        const channel = guild.channels.cache.get(targetId);
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor('#8BBEEF')
                .setTitle(`🔍 ${language(guild, 'LK_TITLE_CH')}`)
                .addFields(
                    { name: `📂 ${language(guild, 'LK_F_TYPE')}`, value: language(guild, 'LK_V_TYPE_CH'), inline: true },
                    { name: `🏷️ ${language(guild, 'LK_F_NAME')}`, value: `${channel.toString()} (\`#${channel.name}\`)`, inline: true },
                    { name: `🆔 ${language(guild, 'LK_F_ID')}`, value: `\`${channel.id}\``, inline: true },
                    { name: `📅 ${language(guild, 'LK_F_CREATED')}`, value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F> (<t:${Math.floor(channel.createdTimestamp / 1000)}:R>)`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username} ${language(guild, 'LK_FOOTER')}` });

            return interaction.editReply({ embeds: [embed] });
        }

        // 2. ROLLEN-LOOKUP
        const role = guild.roles.cache.get(targetId);
        if (role) {
            const embed = new EmbedBuilder()
                .setColor(role.hexColor === '#000000' ? '#8BBEEF' : role.hexColor)
                .setTitle(`🔍 ${language(guild, 'LK_TITLE_ROLE')}`)
                .addFields(
                    { name: `📂 ${language(guild, 'LK_F_TYPE')}`, value: language(guild, 'LK_V_TYPE_ROLE'), inline: true },
                    { name: `🏷️ ${language(guild, 'LK_F_NAME')}`, value: `${role.toString()} (\`@${role.name}\`)`, inline: true },
                    { name: `🎨 ${language(guild, 'LK_F_COLOR')}`, value: `\`${role.hexColor}\``, inline: true },
                    { name: `👑 ${language(guild, 'LK_F_MENTION')}`, value: role.mentionable ? language(guild, 'LK_YES') : language(guild, 'LK_NO'), inline: true },
                    { name: `🛡️ ${language(guild, 'LK_F_ADMIN')}`, value: role.permissions.has(PermissionFlagsBits.Administrator) ? `${language(guild, 'LK_YES')} ⚠️` : language(guild, 'LK_NO'), inline: true },
                    { name: `📅 ${language(guild, 'LK_F_CREATED')}`, value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username} ${language(guild, 'LK_FOOTER')}` });

            return interaction.editReply({ embeds: [embed] });
        }

        // 3. EMOJI-LOOKUP
        const emoji = guild.emojis.cache.get(targetId);
        if (emoji) {
            const embed = new EmbedBuilder()
                .setColor('#8BBEEF')
                .setTitle(`🔍 ${language(guild, 'LK_TITLE_EMOJI')}`)
                .addFields(
                    { name: `📂 ${language(guild, 'LK_F_TYPE')}`, value: language(guild, 'LK_V_TYPE_EMOJI'), inline: true },
                    { name: `🏷️ ${language(guild, 'LK_F_NAME')}`, value: `\`:${emoji.name}:\``, inline: true },
                    { name: `✨ ${language(guild, 'LK_F_PREVIEW')}`, value: emoji.toString(), inline: true },
                    { name: `📅 ${language(guild, 'LK_F_CREATED')}`, value: `<t:${Math.floor(emoji.createdTimestamp / 1000)}:F>`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username} ${language(guild, 'LK_FOOTER')}` });

            return interaction.editReply({ embeds: [embed] });
        }

        // 4. USER-LOOKUP (GLOBAL)
        try {
            const user = await client.users.fetch(targetId);
            if (user) {
                const member = await guild.members.fetch(targetId).catch(() => null);
                const userType = user.bot ? language(guild, 'LK_V_TYPE_BOT') : language(guild, 'LK_V_TYPE_USER');

                const embed = new EmbedBuilder()
                    .setColor('#8BBEEF')
                    .setTitle(`🔍 ${language(guild, 'LK_TITLE_MEMBER')}`)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: `📂 ${language(guild, 'LK_F_TYPE')}`, value: userType, inline: true },
                        { name: `🏷️ ${language(guild, 'LK_F_TAG')}`, value: `\`${user.tag}\` (${user.toString()})`, inline: true },
                        { name: `🆔 ${language(guild, 'LK_F_ID')}`, value: `\`${user.id}\``, inline: true },
                        { name: `🌐 ${language(guild, 'LK_F_ON_SERVER')}`, value: member ? language(guild, 'LK_YES') : language(guild, 'LK_NO'), inline: true },
                        { name: `📆 ${language(guild, 'LK_F_ACC_CREATED')}`, value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`, inline: false }
                    )
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username} ${language(guild, 'LK_FOOTER')}` });

                if (member && member.joinedTimestamp) {
                    embed.addFields({ name: `📥 ${language(guild, 'LK_F_JOINED')}`, value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false });
                }

                return interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            // Keine gültige ID im gesamten Discord-Netzwerk
        }

        return interaction.editReply({
            content: `❌ **${language(guild, 'LK_NOT_FOUND')}**`
        });
    }
}