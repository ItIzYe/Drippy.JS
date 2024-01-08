const { devs, testServer} = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');


module.exports = async (client, interaction) => {

    if(!interaction.isCommand()) {
        return;
    } else {
        console.log(interaction.commandName)
    }



    const localCommands = getLocalCommands();

    try{
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );


        if(!commandObject) return;

        if(commandObject.devOnly){
            if(!devs.includes(interaction.member.id)){
                interaction.reply({
                    content: 'Only for Devs',
                    ephemeral: true,
                });
                return;
            }
        }

        if(commandObject.testOnly){
            if(!(interaction.guild.id === testServer)){
                interaction.reply({
                    content: 'Only for Dec-Server',
                    ephemeral: true,
                });
                return;
            }
        }

        if(commandObject.permissionsRequired?.length){
            for(const permission of commandObject.permissionsRequired){
                if(!interaction.member.permissions.has(permission)){
                    interaction.reply({
                        content: 'You don´t have the permissions to do that!',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if(commandObject.botPermissions?.length){
            for(const permission of commandObject.botPermissions){
                const bot = interaction.guild.members.me;

                if(!bot.permissions.has(permission)){
                    interaction.reply({
                        content: 'Bot doesn`t have the rights to do this',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }


    await commandObject.callback(client, interaction)
    } catch (error){
        console.log(`${error}`);
    }
}