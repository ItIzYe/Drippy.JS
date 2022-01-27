module.exports = {
    name: "kick",
    description: "Dieser Command kickt einen Member!",
    execute(message, args){
        const member = message.mentions.users.first();
        if(member){
            const memberTarger = message.guild.members.cache.get(member.id);
            member.send(`Du wurdest vom Server ${message.guild.mentions} gekickt`)
            memberTarger.kick();
            message.channel.send(`${member} wurde gekickt`)
        }else{
            message.channel.send('Dieser Member konnte nicht gefunden werden')
        }
    }
}