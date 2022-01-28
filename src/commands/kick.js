const { MessageEmbed, Client } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Dieser Command kickt einen Member!",
    execute(message, args){
        const member = message.mentions.users.first();
        if(member){
            const memberTarger = message.guild.members.cache.get(member.id);
            memberTarger.kick();
            const exampleEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Moderation')
                .setAuthor("JsBot")
                .setDescription(`${member} wurde gekickt.`)
                .addFields({name: 'Grund:', value: `${args[1]}`})
                .setTimestamp()
            
            message.channel.send({ embed: exampleEmbed });
            //message.reply(`${member} wurde gekickt.`)
            //message.reply(`Grund: ${args[1]}`)
        }else{
            const exampleEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Moderation')
                .setAuthor("JsBot")
                .setDescription('Der Command wurde nicht richtig ausgeführt. bitte achte darauf, das alleparameter vorhanden sind.')
                .addFields({name: 'Command:', value: "`#kick @member (reason)`"})
                .setTimestamp()
            message.channel.send({ embed: exampleEmbed})
        }
    }
}