module.exports = {
    name: 'clear',
    description: 'Löscht Nachrichten',
    callback(client, interaction, args){
        if(!args[0]){interaction.reply('Bitte gebe an wieviele Nachrichten gelöscht werden sollen');}
        if(isNaN(args[0])){interaction.reply('Bitte gib eine echte Nummer an');}

        if(args[0] > 100){interaction.reply('Du kannst nicht mehr als 100 Nachrichten gleichzeitig löschen');}
        if(args[0] < 1){ interaction.reply('Du musst mindestens eine Nachricht löschen');}

        args[0]++;
        interaction.channel.messages.fetch({limit: args[0]}).then(messages =>{
            interaction.channel.bulkDelete(messages)
        })
    }
}