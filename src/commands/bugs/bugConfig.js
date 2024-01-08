const {MessageEmbed, Permissions, Client, Interaction} = require('discord.js');
const mongoose = require('mongoose');
const BugConfig = require('../../models/BugConfig.js');
const GuildConfiguration = require("../../models/GuildConfiguration");


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: "bug-config",
    description: "Bug Report",
    devOnly: true,
    //testOnly: true,
    options: [{
        name: "set-status",
        description: "Please set the status of the bug",
        type: 3,
        choices: [{name:'pending',description:'Set status', value:'Pending'}, {name:'approved',description:'Set status', value: 'Approved'},{name:'denied', description:'Set status',value: 'Denied'}],
        required: false
    }, {
        name: "set-importance",
        description: "Please set the importance of the bug",
        choices: [{name:'not-important',description:'Set status', value:'Not important'}, {name:'important',description:'Set status', value: 'Important'},{name:'very-important',description:'Set status', value: 'Very important'}],
        type: 3,
        required: false
    }],
    //deleted: Boolean,

    callback: async (client, interaction) => {
        await interaction.deferReply('no');


        if(interaction.options.get('set-status')){
            const new_status = interaction.options.get('set-status').value

            const newCustomId = new BugConfig({
                status: new_status,
            })
            await BugConfig.updateOne();

            await interaction.editReply({content: `${newCustomId.status}`})

        }
        if(interaction.options.get('set-importance')) {
            const new_importance = interaction.options.get('set-importance').value

            const newImportance = new BugConfig({
                importance: new_importance,
            })
            await BugConfig.updateOne();

            await interaction.editReply({content: `${newImportance.importance}`})
        }

        if(new_status === "Pending") {

        }
    }


};