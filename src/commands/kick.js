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
            message.channel.send('Dieser Member konnte nicht gefunden werden')
        }
    }
}