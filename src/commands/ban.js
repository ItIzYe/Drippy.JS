const { Command, MessageEmbed, Client } = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'ban',
    description: 'Dieser Command bannt einen Member!',
    execute( message, args){
        const member = message.mentions.users.first();
        if(member){
            const memberTarger = message.guild.members.cache.get(member.id);
            //memberTarger.ban();
            const exampleEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Moderation')
                .setDescription(`${member} wurde gebannt.`)
                .addFields({name: 'Grund:', value: `${args[1]}`})
                .setTimestamp()
            
            if(fs.existsSync(`../${message.guild.id}/modch.json`)){
                const jsonData= require(`../${message.guild.id}/modch.json`)
                if(jsonData["channel"] === "none"){
                    message.channel.send({ embeds: [exampleEmbed] });
                }else{
                    const channel1 = getNumber(jsonData["channel"])
                    console.log(channel1)
                    channel = message.guild.channels.cache.get(channel1)
                    channel.send({ embeds: [exampleEmbed] });
                }
            }else{
                message.channel.send({ embeds: [exampleEmbed] });
            }
        }else{
            const exampleEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Moderation')
                .setDescription("Der Command wurde nicht richtig ausgeführt. bitte achte darauf, das alle Parameter vorhanden sind.")
                .addFields({name: 'Command:', value: "`#ban @member (grund)`"})
                .setTimestamp()
            
            message.channel.send({ embeds: [exampleEmbed] });
        }
    }
}