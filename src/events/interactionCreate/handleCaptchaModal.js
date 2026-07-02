const { MessageFlags } = require('discord.js');
const VerifyConfig = require('../../models/Verify');
const language = require("../../handlers/languages");

module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== 'captcha_modal') return;

    const { guild, member } = interaction; 

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const ziffer = interaction.fields.getTextInputValue('captcha_id');

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
            const config = await VerifyConfig.findOne({ guildId: guild.id }); 
    
            if (!config || !config.roleId) {
                return await interaction.editReply({ 
                    content: '❌ Fehler: Es wurde noch keine Rolle konfiguriert.' 
                });
            }

            const role = guild.roles.cache.get(config.roleId);
            if (!role) {
                return await interaction.editReply({ 
                    content: '❌ Die konfigurierte Rolle existiert nicht mehr.' 
                });
            }

            try {
                await member.roles.add(role);
                const successMsg = language(guild, 'VERIFY_SUCCESS').replace('{role}', role.name);
                await interaction.editReply({ content: successMsg });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ 
                    content: '❌ Mir fehlen die Berechtigungen für diese Rolle (Prüfe die Rollenhierarchie!).' 
                });
            }
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
};