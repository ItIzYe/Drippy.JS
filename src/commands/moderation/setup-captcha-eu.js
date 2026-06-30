const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionsBitField, 
    ApplicationCommandOptionType,
    MessageFlags,
    AttachmentBuilder
} = require('discord.js');
const VerifyConfig = require('../../models/Verify');
const path = require('path');
const language = require("../../handlers/languages");

module.exports = {
    name: 'setup-captcha-eu',
    description: 'Richtet die Verifizierung mit einer spezifischen Rolle ein',
    description_localizations: {
        "en-US": "Set the verification up with a specific role"
    },
    permissionsRequired: [PermissionsBitField.Flags.Administrator],
    options: [
        {
            name: 'rolle',
            description: 'Die Rolle, die nach der Verifizierung vergeben wird',
            description_localizations: {
                "en-US": "The Role given to a User after their verification"
            },  
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: 'channel',
            description: 'Der Kanal, in dem die User sich verifizieren können.',
            description_localizations: {
                "en-US": "The channel in which a user can verify"
            },  
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        const targetRole = interaction.options.getRole('rolle');
        const kanal = interaction.options.getChannel('channel');
        const guild = interaction.guild;

        await VerifyConfig.findOneAndUpdate(
            { guildId: interaction.guildId },
            { roleId: targetRole.id },
            { upsert: true }
        );

        const dateiPfad = path.join(__dirname, '..', '..', 'img', 'perso.jpg'); 
        const bildAttachment = new AttachmentBuilder(dateiPfad, { name: 'perso.jpg' });

        const step1 = language(guild, 'VERIFY_STEP_1').replace('{channel}', `${kanal}`);
        const successMsg = language(guild, 'VERIFY_SETUP_SUCCESS').replace('{role}', targetRole.name);

        const embed = new EmbedBuilder()
            .setTitle(`${language(guild, 'VERIFY_EMBED_TITLE')}`)
            .setImage('attachment://perso.jpg')
            .setDescription(`${language(guild, 'VERIFY_EMBED_DESC')}`)
            .addFields(
              {name: "1.", value: step1, inline: false},
              {name: "2.", value: `${language(guild, 'VERIFY_STEP_2')}`, inline:false},
              {name: "3.", value: `${language(guild, 'VERIFY_STEP_3')}`, inline:false},
              {name: `${language(guild, 'VERIFY_PRIVACY_TITLE')}`, value: `${language(guild, 'VERIFY_PRIVACY_DESC')}`})
            .setColor('Blue');

        

        await interaction.channel.send({ embeds: [embed], files: [bildAttachment], });

        await interaction.reply({ 
            content: successMsg, 
            flags: [MessageFlags.Ephemeral] 
        });
    }
};