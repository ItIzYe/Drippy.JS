const {Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle,} = require('discord.js');
const Suggestion = require('../../models/Suggestion')
const formatResults = require('../../utils/formatResults');
/**
 *
 * @param {Interaction} interaction
 * @param {Client} client
 * @param {Object} 0param
 */

module.exports = async(client, interaction) => {
    if(!interaction.isButton() || !interaction.customId) return;

    try{
        const [type, suggestionId, action] = interaction.customId.split('.');

        if(!type || !suggestionId || !action) return;
        if(type !== 'suggestion') return;

        await interaction.deferReply({ephemeral:true});

        const targetSuggestion = await Suggestion.findOne({suggestionId});
        const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
        const targetMessageEmbed = targetMessage.embeds[0];

        if(action === 'approve'){
            if(!interaction.memberPermissions.has('Administrator')){
                await interaction.editReply('Dir fehlen die Rechte dafür');
                return;
            }

            targetSuggestion.status = 'approved';

            targetMessageEmbed.data.color = 0x84e660;
            targetMessageEmbed.fields[1].value = '✅Approved';

            await targetSuggestion.save();

            interaction.editReply('Suggestion wurde angenommen');

            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [targetMessage.components[0]],
            })

            return;
        }

        if(action === 'reject'){
            if(!interaction.memberPermissions.has('Administrator')){
                await interaction.editReply('Dir fehlen die Rechte dafür');
                return;
            }

            targetSuggestion.status = 'rejected';

            targetMessageEmbed.data.color = 0xff6161;
            targetMessageEmbed.fields[1].value = '❌Rejected'

            await targetSuggestion.save();

            interaction.editReply('Suggestion rejected');

            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [targetMessage.components[0]]
            })

            return;

        }

        if(action === 'upvote'){
            const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);

            if(hasVoted){
                await interaction.editReply('Du hast schon gevotet')
                return;
            }

            targetSuggestion.upvotes.push(interaction.user.id);

            await targetSuggestion.save();

            interaction.editReply('Suggestion wurde geupvotet')

            targetMessageEmbed.fields[2].value = formatResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );

            targetMessage.edit({
                embeds: [targetMessageEmbed]
            });

            return;
        }
        if(action === 'downvote'){
            const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);

            if(hasVoted){
                await interaction.editReply('Du hast schon gevotet')
                return;
            }

            targetSuggestion.downvotes.push(interaction.user.id);

            await targetSuggestion.save();

            interaction.editReply('Suggestion wurde gedownvotet')

            targetMessageEmbed.fields[2].value = formatReusults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );

            targetMessage.edit({
                embeds: [targetMessageEmbed]
            });

            return;
        }
    } catch(error){
        console.log(`Error in handleSuggestion.js ${error}`)
    }
}