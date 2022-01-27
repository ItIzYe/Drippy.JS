module.exports = {
    name: "kick",
    description: "Dieser Command kickt einen Member!",
    execute(message, args){
        const member = message.mentions.users.first();
        if(member){
            const memberTarger = message.guild.members.cache.get(member.id);
            //memberTarger.kick();
            message.reply(`${member} wurde gekickt.`)
            message.reply(`Grund: ${args[1]}`)
        }else{
            message.channel.send('Dieser Member konnte nicht gefunden werden')
        }
    }
}