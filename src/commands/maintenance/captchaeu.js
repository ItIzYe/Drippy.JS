const { EmbedBuilder, Permissions, Client, Interaction, MessageFlags } = require('discord.js');
const mongoose = require('mongoose');
const VerifyConfig = require('../../models/Verify');
const language = require('../../handlers/languages');

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "captcha-eu",
    description: "Captcha (EU and Schengen Area)",
    description_localizations: {
        "de": "Verifiziere dein Alter für den EU-/Schengen-Raum"
    },
    options: [{
        name: "id",
        description: "Please enter your ID",
        description_localizations: {
            "de": "Bitte gib deine 7-stellige Ziffernkette ein"
        },
        type: 3,
        required: true
    }],

    callback: async (client, interaction) => {
        const { guild, member } = interaction;

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const config = await VerifyConfig.findOne({ guildId: guild.id });
        if (!config || !config.roleId) {
            return await interaction.editReply({ 
                content: language(guild, 'VERIFY_ERROR_NO_CONFIG')
            });
        }
        
        const role = guild.roles.cache.get(config.roleId);
        if (!role) {
            return await interaction.editReply({ 
                content: language(guild, 'VERIFY_ERROR_ROLE_NOT_FOUND')
            });
        }

        const ziffer = interaction.options.get('id').value;

        if (!ziffer || ziffer.length !== 7 || isNaN(ziffer)) {
            return await interaction.editReply({
                content: language(guild, 'VERIFY_ERROR_INVALID_FORMAT')
            });
        }

        let j = 0;
        let i = 0;
        for (let n = 0; n < 6; n++) {
            if (i === 0) {
                j = j + (Number(ziffer[n]) * 7);
                i++;
            } else if (i === 1) {
                j = j + (Number(ziffer[n]) * 3);
                i++;
            } else if (i === 2) {
                j = j + (Number(ziffer[n]) * 1);
                i = 0;
            }
        }

        const berechneterRest = j % 10;
        const echtePruefziffer = Number(ziffer[6]);

        if (berechneterRest !== echtePruefziffer) {
            return await interaction.editReply({
                content: language(guild, 'VERIFY_ERROR_WRONG_CAPTCHA')
            });
        }

        const d = new Date();
        const aktuellesJahrVierStellig = d.getFullYear();
        const aktuellesJahrZweiStellig = Number(String(aktuellesJahrVierStellig).slice(-2));

        const heuteZahl = Number(
            String(aktuellesJahrVierStellig) + 
            String(d.getMonth() + 1).padStart(2, '0') + 
            String(d.getDate()).padStart(2, '0')
        );

        const jahrZweiStellig = Number(ziffer[0] + ziffer[1]);
        const monatUndTag = ziffer.slice(2, 6);

        let jahrVierStellig;
        if (jahrZweiStellig <= aktuellesJahrZweiStellig) {
            jahrVierStellig = "20" + ziffer[0] + ziffer[1];
        } else {
            jahrVierStellig = "19" + ziffer[0] + ziffer[1];
        }

        const geburtsdatumKomplett = Number(jahrVierStellig + monatUndTag);
        const check = heuteZahl - geburtsdatumKomplett;

        if (check >= 160000) {
            try {
                await member.roles.add(role);
                
                const successMsg = language(guild, 'VERIFY_SUCCESS').replace('{role}', role.name);
                await interaction.editReply({ content: successMsg });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ 
                    content: language(guild, 'VERIFY_ERROR_NO_PERMS')
                });
            }
        } else {
            await interaction.editReply({ 
                content: language(guild, 'VERIFY_ERROR_TOO_YOUNG')
            });
        }
    }
};