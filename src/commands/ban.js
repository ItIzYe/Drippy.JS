const { MessageEmbed, Client } = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Dieser Command bannt einen Member!',
    execute(message, args){
        const member = message.mentions.users.first();
        if(member){
            const memberTarger = message.guild.members.cache.get(member.id);
            memberTarger.ban();
            const exampleEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Moderation')
                .setAuthor("JsBot")
                .setDescription(`${member} wurde gebannt.`)
                .addFields({name: 'Grund:', value: `${args[1]}`})
                .setTimestamp()
            
            message.channel.send({ embed: exampleEmbed });
            member.send(`Du wurdes vom Server ${message.guild.mentions} gekickt`)
        }else{
            const exampleEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Moderation')
                .setAuthor("JsBot")
                .setDescription("Der Command wurde nicht richtig ausgeführt. bitte achte darauf, das alle Parameter vorhanden sind.")
                .addFields({name: 'Command:', value: "`#ban @member (grund)`"})
                .setTimestamp()
            
            message.channel.send({ embed: exampleEmbed });
        }
    }
}