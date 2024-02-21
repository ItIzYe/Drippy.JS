const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');

const { languages } = require('../../../lang.json');

const languageSchema = require('../../models/LanguageSchema');
const mongoose = require('mongoose');

const { setLanguage} = require('../../handlers/languages');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: 'set-lang',
    description: 'Set the language for your commands',
    options: [
        {
            name: 'select-language',
            description: 'you can choose between english and german.',
            type: 3,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],

    callback: async(client, interaction) => {
        const {guild} = interaction;

        const targetLanguage = interaction.options.get('select-language').value.toLowerCase();
        console.log(targetLanguage)

        if(!languages.includes(targetLanguage)){
            interaction.reply('That language is not supported.');
        }

        setLanguage(guild, targetLanguage)

        try{await languageSchema.findOneAndUpdate({
            _id: guild.id
        }, {
            _id: guild.id,
            language: targetLanguage
        }, {
            upsert: true
        })
            await interaction.reply('Language as been set!');
        } catch (e) {}


    }

}
