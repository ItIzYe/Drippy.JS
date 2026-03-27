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
    name: 'config-levels',
    description: 'Configure your if you want Level-up messages sent into a specific channel',
    options:
        [{
        name: 'add',
        description: 'Add a levels channel.',
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
        description: 'Remove a levels channel.',
        type: 1,
        options: [{
            name: 'channel',
            description: 'The channel you want to remove',
            type: 7,
            required: true
            }]
        }],
    permissionsRequired: [PermissionsBitField.Administrator],
    //testOnly: true,
    deleted: true,

    callback: async(client, interaction) => {
        const { guild } = interaction

        let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId});

        if(!guildConfiguration) {
            guildConfiguration = new GuildConfiguration({ guildId: interaction.guildId});
        }
        ///const subcommand = interaction.options.get('config-suggestions')();

        if(interaction.options.getSubcommand() === 'add'){
            const channel = interaction.options.getChannel('channel');

            if(guildConfiguration.levelChannelIds.includes(channel.id)){
                await interaction.reply(`${channel} ${language(guild, 'CONFIG_LEVEL_ALREADY')}`);
                return;
            }

            guildConfiguration.levelChannelIds.push(channel.id)
            await guildConfiguration.save();

            await interaction.reply(`${channel} ${language(guild, 'CONFIG_LEVEL_ADDED')}`);
            return;
        };

        if(interaction.options.getSubcommand() === 'remove'){
            const channel = interaction.options.getChannel('channel');

            if(!guildConfiguration.levelChannelIds.includes(channel.id)){
                await interaction.reply(`${channel} ${language(guild, 'CONFIG_LEVEL_NOT')}`);
                return;
            }

            guildConfiguration.levelChannelIds = guildConfiguration.levelChannelIds.filter((id) =>id !== channel.id)
            await guildConfiguration.save();

            await interaction.reply(`${channel} ${language(guild, 'CONFIG_LEVEL_REM')}`);
            return;
        }
    }




   /** data: {},
    run: () => {},
    options: {}**/
}
