const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits, Permissions, EmbedBuilder,
} = require('discord.js');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: 'clear',
    description: 'Löscht Nachrichten',
    options: [{
        name: 'amount',
        type: 4,
        description: 'How many messages do you want to delete',
        required: true
    }],
    permissionsRequired:[PermissionFlagsBits.MessageManager],


    callback: async (client, interaction) => {
        const args = interaction.options.get('amount').value;
        if(!args) return interaction.reply('Bitte gebe an wieviele Nachrichten gelöscht werden sollen');
        if(isNaN(args)) return interaction.reply('Bitte gib eine echte Nummer an');

        if(args > 100) return interaction.reply('Du kannst nicht mehr als 100 Nachrichten gleichzeitig löschen');
        if(args < 1) return interaction.reply('Du musst mindestens eine Nachricht löschen');

        args[0]++;

        await interaction.channel.messages.fetch({limit: args}).then(messages =>{
            interaction.channel.bulkDelete(messages)
        })
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Clear')
            .setDescription(`${args} Nachrichten wurden gelöscht`)
        await interaction.reply({embeds:[embed]})
    }
};