const {EmbedBuilder, Permissions, Client, Interaction, MessageFlags} = require('discord.js');
const mongoose = require('mongoose');
const BugConfig = require('../../models/BugConfig');
const GuildConfiguration = require("../../models/GuildConfiguration");
const VerifyConfig = require('../../models/Verify');

const language = require('../../handlers/languages')

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: "captcha-eu",
    description: "Captcha (EU and Schengen Area)",
    //devOnly: true,
    //testOnly: true,
    options: [{
        name: "id",
        description: "Please enter your ID",
        type: 3,
        required: true
    }],
    //deleted: Boolean,

    callback: async (client, interaction) => {
        //console.log(interaction)
        await interaction.deferReply();

        const { guild, member, user, customId } = interaction;

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



        const ziffer = interaction.options.get('id').value;

        let j = 0;
        let i = 0;

        for(let n = 0; n < 6; n++){
          if(i === 0){
            j = j + (Number(ziffer[n]) * 7);
            i++;
          } else if(i === 1){
            j = j + (Number(ziffer[n]) * 3);
            i++;
          }else if(i === 2){
            j = j + (Number(ziffer[n]) * 1);
            i = 0;
          }
        }

        const d = new Date();

        const yy = String(d.getFullYear()).slice(-2);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const datumString = yy + mm + dd;
        const datumInteger = Number(datumString);
        console.log(datumInteger);

        const alter = String(ziffer.slice(0, 6));
        const check = datumInteger - Number(alter);
        if(check >= 160000){
          try {
                  await member.roles.add(role);
                  await interaction.editReply({ 
                      content: `✅ Du wurdest erfolgreich verifiziert und hast die Rolle **${role.name}** erhalten!`, 
                      flags: [MessageFlags.Ephemeral] 
                  });
              } catch (error) {
                  console.error(error);
                  await interaction.editReply({ 
                      content: '❌ Mir fehlen die Berechtigungen für diese Rolle.', 
                      flags: [MessageFlags.Ephemeral] 
                  });
              }
        }else{
          return await interaction.editReply({ 
                      content: '⚠️ Dein Account ist noch zu neu für diesen Server.', 
                      flags: [MessageFlags.Ephemeral] 
                  });
        }


      }
};