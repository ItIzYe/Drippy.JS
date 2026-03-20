const { EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "userinfo",
    description: "Zeigt detaillierte Informationen über einen Benutzer an",
    callback: async (client, interaction) => {
        // Ziel-User bestimmen
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id);

        // Alle Rollen holen, außer @everyone, und in einen String umwandeln
        // .filter sorgt dafür, dass die Standardrolle @everyone nicht in der Liste auftaucht
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
                { name: "🎭 Alle Rollen: ", value: roles, inline: false }, // Hier werden alle Rollen angezeigt
                { name: "🤖 Bot: ", value: targetUser.bot ? "Ja" : "Nein", inline: true }
            )
            .setFooter({ text: `Abgefragt von ${interaction.user.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [userInfoEmbed] });
    }
};