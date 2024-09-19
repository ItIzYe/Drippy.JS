const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    GuildMember,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: 'simulate-join',
    description: 'Simulate a member joining.',
    deleted: false,
    options: [{
        name: 'target-user',
        description: 'The user you want to emulate joining.',
        type: ApplicationCommandOptionType.Mentionable,
    }],

    callback: async (client, interaction) => {
        const targetUser = interaction.options.get('target-user').value;
        console.log(targetUser);

        let member;

        if (targetUser) {
            member =
                interaction.guild.members.cache.get(targetUser.id) ||
                (await interaction.guild.members.fetch(targetUser.id));
        } else {
            member = interaction.member;
        }

        client.emit('guildMemberAdd', member);

        interaction.reply('Simulated join!');
    }
}