const { EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "userinfo",
    description: "Zeigt detaillierte Informationen über einen Benutzer an",
    testOnly: true,
    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id);

        const roles = member.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => role.toString())
            .join(', ') || 'Keine Rollen';

        const userInfoEmbed = new EmbedBuilder()
            .setColor("#00fdfe")
            .setTitle(`Informationen über ${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👤 Account Name: ", value: targetUser.tag, inline: true },
                { name: "🆔 User ID: ", value: targetUser.id, inline: true },
                { name: "📅 Account erstellt: ", value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: false },
                { name: "📥 Server beigetreten: ", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: false },
                { name: "🎭 Alle Rollen: ", value: roles, inline: false },
                { name: "🤖 Bot: ", value: targetUser.bot ? "Ja" : "Nein", inline: true }
            )
            .setFooter({ text: `Abgefragt von ${interaction.user.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [userInfoEmbed] });
    }
};