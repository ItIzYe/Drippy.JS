const GuildConfiguration = require('../../models/GuildConfiguration');
const ImageConfiguration = require('../../models/Images');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');
const language = require("../../handlers/languages");


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: 'announcement',
    description: 'Create an Bot announcement',
    devOnly: true,
    testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    options: [
        {
            name: 'message',
            description: 'Enter the message.',
            type: 3,
            required: true,
        },
        {
            name: 'message-type',
            description: 'Enter the message.',
            type: 3,
            required: true,
        },

    ],
    testOnly: true,

   callback: async (client, interaction) => {
    // 1. Defer reply, da das Senden an viele Guilds Zeit benötigt
    await interaction.deferReply({ ephemeral: true });

    const announcement_message = interaction.options.getString('message');
    const announcement_type = interaction.options.getString('message-type');

    const embed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle('ANNOUNCEMENT - ANKÜNDIGUNG')
        .setDescription('The following Announcement will be broadcasted in English.')
        .addFields(
            { name: `${announcement_type}`, value: `${announcement_message}`, inline: true }
        );

    // 2. Benutze eine for...of Schleife für asynchrone Abläufe
    const guilds = client.guilds.cache.values();

    for (const guild of guilds) {
        try {
            // 3. WICHTIG: await benutzen!
            let guildConfiguration = await GuildConfiguration.findOne({ guildId: guild.id });
            
            let targetChannel;

            if (guildConfiguration?.announcementChannelIds?.length > 0) {
                targetChannel = await client.channels.fetch(guildConfiguration.announcementChannelIds[0]).catch(() => null);
            } else {
                // Fallback auf System Channel
                targetChannel = guild.systemChannel;
            }

            if (targetChannel) {
                await targetChannel.send({ embeds: [embed] }).catch(err => console.log(`Senden fehlgeschlagen für ${guild.name}`));
            }
        } catch (error) {
            console.error(`Fehler bei Guild ${guild.id}: ${error}`);
        }
    }

    // 4. Abschlussmeldung
    await interaction.editReply("Announcement has been sent to all reachable guilds.");
},
};
