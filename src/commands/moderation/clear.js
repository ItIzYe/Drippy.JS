const GuildConfiguration = require('../../models/GuildConfiguration');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits, Permissions, EmbedBuilder,
} = require('discord.js');
const language = require("../../handlers/languages");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: 'clear',
    description: 'Deletes a specific amount of Messages',
    options: [{
        name: 'amount',
        type: 4,
        description: 'How many messages do you want to delete',
        required: true
    }],
    permissionsRequired:[PermissionFlagsBits.MessageManager],


    callback: async (client, interaction) => {

        const { guild } = interaction

        const args = interaction.options.get('amount').value;
        if(!args) return interaction.reply(`${language(guild, 'CLEAR_GIVE_AMOUNT')}`);
        if(isNaN(args)) return interaction.reply(`${language(guild, 'CLEAR_REAL')}`);

        if(args > 100) return interaction.reply(`${language(guild, 'CLEAR_MORE_THAN_100')}`);
        if(args < 1) return interaction.reply(`${language(guild, 'CLEAR_LESS_THAN_1')}`);

        args[0]++;

        await interaction.channel.messages.fetch({limit: args}).then(messages =>{
            interaction.channel.bulkDelete(messages)
        })
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Clear')
            .setDescription(`${args} ${language(guild, 'CLEAR_EMBED_DESCRIPTION')}`)
        await interaction.reply({embeds:[embed]})
    }
};