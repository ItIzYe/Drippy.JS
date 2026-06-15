const { EmbedBuilder, Client, Interaction } = require('discord.js');
const language = require("../../handlers/languages");
const { execSync } = require('child_process');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "info",
    description: "Get Infos about Drippy",
    //testOnly: true,

    callback: async (client, interaction) => {
        const { guild } = interaction;

        let commitCount = '0';
        let lastUpdate = 'Unbekannt';
        
        try {
            commitCount = execSync('git rev-list --count HEAD').toString().trim();
            
            lastUpdate = execSync('git log -1 --format=%cr').toString().trim();
        } catch (error) {
            console.error("Git konnte nicht ausgelesen werden. Läuft der Bot in einem Git-Repository?", error);
        }

        const botVersion = `1.8.0.${commitCount}`;

        const totalServers = client.guilds.cache.size;
        const totalUsers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

        const totalSeconds = process.uptime();
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        const uptimeString = days > 0 
            ? `${days}d ${hours}h ${minutes}m` 
            : `${hours}h ${minutes}m`;


        const infoEmbed = new EmbedBuilder()
            .setColor("#1f8a4c")
            .setTitle("Info")
            .setDescription(`${language(guild, 'BOT_DESC')}`)
            .addFields(
                { name: "Name", value: "Drippy#5683", inline: false },
                { name: "Developer", value: "itizye,\nr.m.stitanic,\ncanadianagent", inline: false },
                
                { 
                    name: `📊 ${language(guild, 'INFO_FIELD2') || 'Statistiken'}`, 
                    value: `• Server: **${totalServers}**\n• User gesamt: **${totalUsers}**`, 
                    inline: true 
                },
                
                { 
                    name: "⚙️ Technische Details", 
                    value: `• Version: \`${botVersion}\`\n• Letztes Update: **${lastUpdate}**\n• Uptime: **${uptimeString}**`, 
                    inline: true 
                },

                { name: "Links", value:'[Support Server](https://discord.gg/ZKEmWuYgw5)\n[ToS](https://gist.github.com/ItIzYe/b26cf707f91f18dc8205c572da48fc4f)\n[Privacy Policy](https://gist.github.com/ItIzYe/d00c1bc3b8aae7fd21bc809173d9bf65)', inline: false },
                
                { name: `${language(guild, 'INFO_FIELD6')}`, value: `${language(guild, 'INFO_FIELD6_VALUE')}`, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [infoEmbed] });
    }
}