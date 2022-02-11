const { MessageEmbed} = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "kick",
    description: "Dieser Command kickt einen Member!",
    execute( message, args){
        const member = message.mentions.users.first();
        if(member){
            const memberTarger = message.guild.members.cache.get(member.id);
            //memberTarger.kick();
            const exampleEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Moderation')
                .setAuthor("JsBot")
                .setDescription(`${member} wurde gekickt.`)
                .addFields({name: 'Grund:', value: `${args[1]}`})
                .setTimestamp()

            fs.existsSync(`./servers/${message.guild.id}/modch.json`, (exists) => {
                console.log(exists ? 'Found' : 'Not found!');
            });
            const jsonData= require(`./servers/${message.guild.id}/modch.json`)
            channel1 = jsonData.channel;
            if(channel1 === "none"){
                message.channel.send({ embeds: [exampleEmbed] });
            }else if(channel1 !== "none"){
                channel3 = message.guild.channels.cache.find(channel => channel.id === channel1)
                channel3.send({ embeds: [exampleEmbed] });
            }
            !fs.existsSync(`./servers/${message.guild.id}/modch.json`, (exists) => {
                console.log(exists ? 'Found' : 'Not found!');
            });
            message.channel.send({ embeds: [exampleEmbed] });
        
        }else{
            const exampleEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Moderation')
                .setAuthor("JsBot")
                .setDescription('Der Command wurde nicht richtig ausgeführt. bitte achte darauf, das alle parameter vorhanden sind.')
                .addFields({name: 'Command:', value: "`#kick @member (reason)`"})
                .setTimestamp()
            message.channel.send({ embed: exampleEmbed})
        }
    }
}