const {MessageEmbed} = require("discord.js");
module.exports = {
    name: 'ping',
    description: 'Gibt Latenz zurück',
    async execute(client, message, args){

        const pingEmbed = new MessageEmbed()
            .setColor("#fd5833")
            .setTitle("Pong!")
            .setDescription(`${client.latency * 1000} ms`)

        await message.reply({embeds: [pingEmbed]});

    }
}

