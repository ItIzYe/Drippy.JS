const { MessageFlags } = require('discord.js');
const VerifyConfig = require('../../models/Verify');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;
    if (!['verify_age_confirm', 'verify_age_deny'].includes(interaction.customId)) return;

    const { guild, member, user, customId } = interaction;

    // 1. Fall: Ablehnen
    if (customId === 'verify_age_deny') {
        await user.send('Du bist leider noch zu jung für diesen Server.').catch(() => {});
        await member.kick('Alter unter 16 (selbst angegeben)');
        return await interaction.reply({ 
            content: 'Du hast angegeben, dass du zu jung bist und wurdest vom Server entfernt.', 
            flags: [MessageFlags.Ephemeral] 
        });
    }

    // 2. Fall: Bestätigen
    const config = await VerifyConfig.findOne({ guildId: guild.id });
    
    if (!config || !config.roleId) {
        return await interaction.reply({ 
            content: '❌ Fehler: Es wurde noch keine Rolle konfiguriert.', 
            flags: [MessageFlags.Ephemeral] 
        });
    }

    const role = guild.roles.cache.get(config.roleId);
    if (!role) {
        return await interaction.reply({ 
            content: '❌ Die konfigurierte Rolle existiert nicht mehr.', 
            flags: [MessageFlags.Ephemeral] 
        });
    }

    // Account-Alter-Check (7 Tage)
    const minAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - user.createdTimestamp < minAge) {
        return await interaction.reply({ 
            content: '⚠️ Dein Account ist noch zu neu für diesen Server.', 
            flags: [MessageFlags.Ephemeral] 
        });
    }

    try {
        await member.roles.add(role);
        await interaction.reply({ 
            content: `✅ Du wurdest erfolgreich verifiziert und hast die Rolle **${role.name}** erhalten!`, 
            flags: [MessageFlags.Ephemeral] 
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({ 
            content: '❌ Mir fehlen die Berechtigungen für diese Rolle.', 
            flags: [MessageFlags.Ephemeral] 
        });
    }
};