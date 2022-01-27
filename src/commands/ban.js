module.exports = {
    name: 'ban',
    description: 'Dieser Command bannt einen Member!',
    execute(message, args){
        const member = message.mentions.users.first();
        if(member){
            const memberTarger = message.guild.members.cache.get(member.id);
            memberTarger.ban();
            message.channel.send(`${member} wurde gekickt`)
            member.send(`Du wurdes vom Server ${message.guild.mentions} gekickt`)
        }else{
            message.channel.send('Dieser Member konnte nicht gefunden werden')
        }
    }
}