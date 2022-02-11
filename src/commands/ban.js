const { channel } = require("diagnostics_channel");
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
            
            fs.existsSync(`./servers/${message.guild.id}/modch.json`, (exists) => {
                console.log(exists ? 'Found' : 'Not found!');
            });
            const jsonData= require(`./servers/${message.guild.id}/modch.json`)
            console.log(jsonData);
            channel1 = jsonData.channel;
            console.log(channel1);
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
                .setDescription("Der Command wurde nicht richtig ausgeführt. bitte achte darauf, das alle Parameter vorhanden sind.")
                .addFields({name: 'Command:', value: "`#ban @member (grund)`"})
                .setTimestamp()
            
            message.channel.send({ embeds: [exampleEmbed] });
        }
    }
}