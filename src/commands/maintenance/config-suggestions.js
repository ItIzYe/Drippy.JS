const GuildConfiguration = require('../../models/GuildConfiguration');
const {Client, Interaction, GuildChannelTypes, PermissionsBitField,} = require('discord.js')
const mongoose = require('mongoose');

const language = require("../../handlers/languages");


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: 'config-suggestions',
    description: 'Configure your suggestions',
    options:
        [{
        name: 'add',
        description: 'Add a suggestions channel.',
        type: 1,
        options: [{
            name: 'channel',
            description: 'The channel you want to add',
            type: 7,
            required: true
            }]
        },
        {
        name: 'remove',
        description: 'Remove a suggestions channel.',
        type: 1,
        options: [{
            name: 'channel',
            description: 'The channel you want to remove',
            type: 7,
            required: true
            }]
        }],
    permissionsRequired: [PermissionsBitField.Administrator],

    callback: async(client, interaction) => {
        const { guild } = interaction

        let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId});

        if(!guildConfiguration) {
            guildConfiguration = new GuildConfiguration({ guildId: interaction.guildId});
        }
        ///const subcommand = interaction.options.get('config-suggestions')();

        if(interaction.options.getSubcommand() === 'add'){
            const channel = interaction.options.getChannel('channel');

            if(guildConfiguration.suggestionChannelIds.includes(channel.id)){
                await interaction.reply(`${channel} ${language(guild, 'CONFIG_SUGG_ALREADY')}`);
                return;
            }

            guildConfiguration.suggestionChannelIds.push(channel.id)
            await guildConfiguration.save();

            await interaction.reply(`${channel} ${language(guild, 'CONFIG_SUGG_ADDED')}`);
            return;
        };

        if(interaction.options.getSubcommand() === 'remove'){
            const channel = interaction.options.getChannel('channel');

            if(!guildConfiguration.suggestionChannelIds.includes(channel.id)){
                await interaction.reply(`${channel} ${language(guild, 'CONFIG_SUGG_NOT')}`);
                return;
            }

            guildConfiguration.suggestionChannelIds = guildConfiguration.suggestionChannelIds.filter((id) =>id !== channel.id)
            await guildConfiguration.save();

            await interaction.reply(`${channel} ${language(guild, 'CONFIG_SUGG_REM')}`);
            return;
        }
    }




   /** data: {},
    run: () => {},
    options: {}**/
}