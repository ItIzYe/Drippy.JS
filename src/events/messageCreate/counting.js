const { Client, Message } = require('discord.js');
const GuildConfiguration = require('../../models/GuildConfiguration');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    // 1. Ignore bots
    if (message.author.bot) return;

    try {
        const { guild } = message;
        
        // Load configuration
        let guildConfiguration = await GuildConfiguration.findOne({ guildId: message.guildId });

        // 2. Check if config exists AND has channel IDs
        if (guildConfiguration && guildConfiguration.countingChannelIds && guildConfiguration.countingChannelIds.length > 0) {
            
            // Get the ID string directly
            const targetChannelId = guildConfiguration.countingChannelIds[0];

            // 3. Check if we are in the right channel
            if (message.channel.id !== targetChannelId) return;

            const currentNumber = parseInt(message.content);

            // 4. If message is not a number, delete it
            if (isNaN(currentNumber)) {
                await message.delete();
                return;
            }

            // 5. Fetch history
            const messages = await message.channel.messages.fetch({ limit: 2 });

            // Handle start of channel (only 1 message exists)
            if (messages.size < 2) {
                if (currentNumber !== 1) {
                    await message.delete();
                    await message.channel.send(`${message.author}, count starts at 1!`)
                        .then(msg => setTimeout(() => msg.delete(), 5000));
                }
                return;
            }

            // Get previous number
            const previousMessage = messages.last();
            const previousNumber = parseInt(previousMessage.content);

            if (isNaN(previousNumber)) return;

            // 6. Compare (Fixed Syntax Here)
            if (currentNumber !== previousNumber + 1) {
                await message.delete();
                const warning = await message.channel.send(`${message.author}, incorrect number! Next is **${previousNumber + 1}**.`);
                setTimeout(() => warning.delete(), 3000);
            } else {
                // Optional: React to correct number
                await message.react('✅');
            }

        } else {
            // This handles the "No channel specified" case
            console.log("No counting channel configured.");
        }
    } catch (error) {
        console.error("Error in counting logic:", error);
    }
};

