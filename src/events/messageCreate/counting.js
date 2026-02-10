const { Client, Message } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    // 1. Ignore bots immediately to save resources
    if (message.author.bot) return;

    const { guild } = message;
    
    // Ensure we have a configuration
    let guildconfiguration = await GuildConfiguration.findOne({ guildId: message.guildId });
    
    // Check if config exists and has channel IDs
    if (guildconfiguration && guildconfiguration.countingChannelIds && guildConfiguration.countingChannelIds.length > 0) {
        
        // Get the specific counting channel ID for this guild
        const targetChannelId = guildconfiguration.countingChannelIds[0];

        // 2. Check if the message is in the correct channel
        if (message.channel.id !== targetChannelId) return;

        const currentNumber = parseInt(message.content);

        // 3. If it's not a number, delete it
        if (isNaN(currentNumber)) {
            await message.delete();
            return;
        }

        try {
            // Fetch the last 2 messages
            const messages = await message.channel.messages.fetch({ limit: 2 });

            // Handle the very first number in the channel
            if (messages.size < 2) {
                if (currentNumber !== 1) {
                    await message.delete();
                    await message.channel.send(`${message.author}, count starts at 1!`)
                        .then(msg => setTimeout(() => msg.delete(), 5000));
                }
                return;
            }

            // Get the previous message
            const previousMessage = messages.last();
            const previousNumber = parseInt(previousMessage.content);

            // If the previous message wasn't a number (rare edge case), ignore or handle
            if (isNaN(previousNumber)) {
                return;
            }

            // 4. FIX: Corrected spelling and syntax
            if (currentNumber !== previousNumber + 1) {
                await message.delete();
                const warning = await message.channel.send(`${message.author}, incorrect Number!`);
                setTimeout(() => warning.delete(), 3000);
            } else {
                // Optional: React to correct numbers
               // await message.react('✅');
            }

        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    } else {
        // This handles the "else" for the main guildConfiguration check
        console.log("No counting channel configured for this guild.");
        return;
    }
};
