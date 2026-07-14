const { EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "leave",
    description: "Lässt den Bot einen Server per ID verlassen (Nur für Bot-Owner)",
    options: [
        {
            name: "id",
            description: "Die ID des Servers, den der Bot verlassen soll",
            type: 3, // String-Typ
            required: true
        }
    ],
    devOnly: true,
    callback: async (client, interaction) => {
        // Ersetze diese ID mit deiner eigenen Discord-User-ID, damit nur du den Befehl nutzen kannst!
        

        const targetGuildId = interaction.options.getString("id");

        try {
            // Erst im Cache suchen, sonst fetschn
            let guild = client.guilds.cache.get(targetGuildId);
            if (!guild) {
                guild = await client.guilds.fetch(targetGuildId);
            }

            if (!guild) {
                return await interaction.reply({ 
                    content: `Server mit der ID ${targetGuildId} wurde nicht gefunden.`, 
                    ephemeral: true 
                });
            }

            await guild.leave();

            const successEmbed = new EmbedBuilder()
                .setColor("#2ecc71")
                .setTitle("Server erfolgreich verlassen")
                .setDescription(`Der Bot hat den Server **${guild.name}** (${targetGuildId}) erfolgreich verlassen.`);

            await interaction.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: `Fehler beim Verlassen des Servers: ${error.message}`, 
                ephemeral: true 
            });
        }
    }
}