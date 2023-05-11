const {Permissions} = require("discord.js");
module.exports = {
    name: "interactionCreateButton",
    description: 'Button reactions',
    callback(client, interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId === "helpMod") {
            if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                client.commands.get("help").callback(interaction, ["mod"]);
            } else {
                client.commands.get("permission_error").callback(client, interaction);
            }
        } if (interaction.customId === "helpLevel") {
            client.commands.get("help").callback(interaction, ["level"]);
        } if (interaction.customId === "helpInfos") {
            client.commands.get("help").callback(interaction, ["info"]);
        } if (interaction.customId === "helpFun") {
            client.commands.get("help").callback(interaction, ["fun"]);
        }
    }
}