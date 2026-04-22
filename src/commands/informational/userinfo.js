const { EmbedBuilder,ApplicationCommandOptionType, Client, Interaction } = require('discord.js');
const languages = require('../../handlers/languages');

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "userinfo",
    description: "Zeigt detaillierte Informationen über einen Benutzer an",
    options: [
        {
            name: 'target-user',
            description: 'The user you want to ban.',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        }
    ],
    //testOnly: true,
    callback: async (client, interaction) => {
        const { guild } = interaction
        await interaction.deferReply();
        const targetUser = interaction.options.getUser('target-user') || interaction.user;
        //const targetUser = await interaction.guild.members.fetch(targetUserId.id);
        const member = await interaction.guild.members.fetch(targetUser.id);

        const roles = member.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => role.toString())
            .join(', ') || 'Keine Rollen';

        const userInfoEmbed = new EmbedBuilder()
            .setColor("#00fdfe")
            .setTitle(`${languages(guild, 'USR_DESC')} ${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👤 Account Name: ", value: targetUser.tag, inline: true },
                { name: "🆔 User ID: ", value: targetUser.id, inline: true },
                { name: `${languages(guild, 'CREATED')}`, value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: false },
                { name: `${languages(guild, 'JOINED')}`, value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: false },
                { name: `${languages(guild, 'ROLES')}`, value: roles, inline: false },
                { name: "🤖 Bot: ", value: targetUser.bot ? "Ja" : "Nein", inline: true }
            )
            .setFooter({ text: `${languages(guild, 'RQST')} ${interaction.user.username}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [userInfoEmbed] });
    }
};