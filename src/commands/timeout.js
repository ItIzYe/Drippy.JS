const {MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const ms = require('ms');
const { Command} = require('reconlx');
//const m = require('./src/channelsettings/modch.json');

module.exports = new Command({
    name: "test",
    description: "Timeoute Member von Text- und Sprachkanälen",
    execute(message, args){
        message.channel.send({content: "Das hier ist ein Test. bitte sende eine Nachricht"})

        const text = 'okay'
        const filter = m => m.author.id === message.author.id

        const collector = message.channel.createMessageCollector({
            filter,
            max: 1,
            time: 5000,
            error: 'time'
       });

        message.channel.send({content: "Welche Settings möchtest du anpassen?"})
        collector.on('collect', m => {
        });
        collector.on('end', collected =>{
            collected.forEach((value) => {
                console.log(value.content)
                const msgcontent = value.content
                if(msgcontent === "Moderation" || "MODERATION" || "moderation") {
                    const button = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId('primary')
                        .setLabel("Kanal einstellen")
                        .setStyle('PRIMARY')
                    );
                    const embed = new MessageEmbed()
			            .setColor('#0099ff')
			            .setTitle('Mod Channels')
			            .setDescription('Setzen sie einen Kanal in den die Modnachrichten gesendet werden');
                    message.reply({content: 'Hier die Settings', ephemeral: true, embeds: [embed], components: [button] })
                };
            
            });
            
         });
      
    },

})