const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const Birthday = require('../models/Birthday');

const BIRTHDAY_CHANNEL_ID = "DEINE_KANAL_ID"; 

module.exports = (client) => {
    cron.schedule('0 9 * * *', async () => {
        const now = new Date();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth() + 1;

        console.log(`[Birthday] Suche nach Geburtstagen für den ${currentDay}.${currentMonth}...`);

        try {
            const birthdays = await Birthday.find({ day: currentDay, month: currentMonth });

            for (const entry of birthdays) {
                const guild = client.guilds.cache.get(entry.guildId);
                if (!guild) continue;

                const channel = guild.channels.cache.get(BIRTHDAY_CHANNEL_ID);
                if (!channel) continue;

                const member = await guild.members.fetch(entry.userId).catch(() => null);
                if (!member) continue;

                const bdayEmbed = new EmbedBuilder()
                    .setColor("#ffcc00")
                    .setTitle("🎉 Alles Gute zum Geburtstag!")
                    .setDescription(`Heute feiern wir den Ehrentag von ${member}! 🎂`)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .addFields({ name: "Party Time", value: "Lass dich ordentlich feiern und genieß deinen Tag! 🎈" })
                    .setTimestamp();

                await channel.send({ content: `Huhu ${member}!`, embeds: [bdayEmbed] });
            }
        } catch (error) {
            console.error("[Birthday Error]", error);
        }
    }, {
        timezone: "Europe/Berlin"
    });
};