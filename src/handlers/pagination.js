const { Actionrowbuilder, ButtonBuilder, ButtonStyle, ComponentType} = require('discord.js');

module.exports = async (interaction, pages, time = 30*1000) => {
    try {
        if (!interaction || !pages || !pages > 0) throw new Error('[Pagination] Invalid args');

        await interaction.deferReply();

        if (pages.length === 1){
            return await interaction.edit({embeds: pages, components:[], fetchReply: true});
        }

        var index = 0;

        const first = new ButtonBuilder()
            .setCustomId('pagefirst')
            .setEmoji('⏪')
            .setStyle(ButtonStyle.PRIMARY)
            .setDisabled(true);

        const prev = new ButtonBuilder()
            .setCustomId('pageprev')
            .setEmoji('◀️')
            .setStyle(ButtonStyle.PRIMARY)
            .setDisabled(true);

        const pageCount = new ButtonBuilder()
            .setCustomId('pagecount')
            .setLabel(`${index + 1}/${pages.length}`)
            .setStyle(ButtonStyle.SECONDARY)
            .setDisabled(true);

        const next = new ButtonBuilder()
            .setCustomId('pagenext')
            .setEmoji('▶️')
            .setStyle(ButtonStyle.PRIMARY);

        const last = new ButtonBuilder()
            .setCustomId('pagelast')
            .setEmoji('⏩')
            .setStyle(ButtonStyle.PRIMARY);

        const buttons = new Actionrowbuilder()
            .addComponents([first, prev, pageCount, next, last]);

        const msg = await interaction.editReply({embeds: [pages[index]], components: [buttons], fetchReply: true})

        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        });

        collector.on('collect', async i =>{
            if (i.user.id !== interaction.user.id) return await i.reply({content: `Only **${interaction.user.username}** can use these buttons!`, ephemeral: true});

            await i.deferUpdate();

            if (i.customId === 'pagefirst') {
                index = 0;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }
            if (i.customId === 'pageprev') {
                if(index > 0) index--;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }
            else if ( i.customId === 'pagenext'){
                if (index < pages.length - 1){
                    index++;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                }
            }
            else if ( i.customId === 'pagelast'){
                index = pages.length -1;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }

            if (index === 0){
                first.setDisabled(true);
                prev.setDisabled(true);
            }
            else{
                first.setDisabled(false);
                prev.setDisabled(false);
            }

            if (index === pages.length - 1){
                next.setDisabled(true)
                last.setDisabled(true)
            }
            else{
                next.setDisabled(false);
                last.setDisabled(false);
            }

            await msg.edit({embeds: [pages[index]], components:[buttons]}).catch(err => {});

            collector.resetTimer();
        });

        collector.om('end', async () =>{
            await msg.edit({embeds: [pages[index]], components: []}).catch(err => {})
        });

        return msg;
    } catch (e) {
        console.log(`ERROR ${error}`);
    }
}