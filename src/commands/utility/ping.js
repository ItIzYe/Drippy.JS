const {MessageEmbed, EmbedBuilder} = require("discord.js");
module.exports = {
    name: 'ping',
    description: 'Gibt Latenz zurück',
    callback(client, interaction, args){

        const pingEmbed = new EmbedBuilder()
            .setColor("#fd5833")
            .setTitle("Pong!")
            .setDescription(`${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms ms`)

        interaction.reply({embeds: [pingEmbed]});

    }
}

