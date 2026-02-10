const {Client, Message} = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');
/**
*
* @param {Client} client
* @param {Message} message}
*
**/
module.exports = async (client, message) => {
    const {guild} = message;
    let guildConfiguration = await GuildConfiguration.findOne({ guildId: message.guildId});
    let countingChannel = await client.channels.cache.get(guildconfiguration.countingChannelIds[0])
    if(guildConfiguration.countingChannelIds) {
        if(message.author.bot) return;
        if(message.channel.id !== countingChannel) return;
       
        const currentNumber = parseInt(message.content);

        if(isNaN(currentNumber)){
            await message.delete();
            return;
        }
        try{
            const messages = await message.channel.messages.fetch({limit: 2});
            if(messages.size < 2){
                if(currentNumber !== 1){
                    await message.delete();
                    await message.channel.send(`${message.author}, count starts at 1!`).then(msg => setTimeout(() => msg.delete(), 5000));
                }
                return;
            }
            const previousMessage = messages.last();
            const previousNumber = parseInt(previousMessage.content);
            if(isNaN(previousNumber)) {
                return;
            }
            if(currentNumber !== previouseNumber +1 {
                await message.delete();
                const warning = await message.channel.send(`${message.author}, incorrect Number!`);
                setTimeout(() => warning.delete(), 3000);
            } else{
                return;
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
    } else if(!guildconfiguration.countingChannelIds) {
        console.log("No channel specified")
        return;
    }


