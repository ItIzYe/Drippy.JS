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
        }
    ],

    callback: async (client, interaction) => {
        const guild = interaction.guild; 
        const targetRole = interaction.options.getRole('rolle');
        
        await VerifyConfig.findOneAndUpdate(
            { guildId: interaction.guildId },
            { roleId: targetRole.id },
            { upsert: true }
        );

        const dateiPfad = path.join(__dirname, '..', '..', 'img', 'perso.jpg'); 
        const bildAttachment = new AttachmentBuilder(dateiPfad, { name: 'perso.jpg' });

        const step1 = language(guild, 'VERIFY_STEP_1'); 
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

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('btn_captcha_verify')
                .setLabel(`${language(guild, 'BTN_CAPTCHA')}`)
                .setStyle(ButtonStyle.Success),
        );
        
        await interaction.channel.send({ embeds: [embed], files: [bildAttachment], components: [row] });

        await interaction.reply({ 
            content: successMsg, 
            flags: [MessageFlags.Ephemeral] 
        });
    }
};