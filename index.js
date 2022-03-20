const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
//const myIntents = new Intents();
//myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING);

const client = new Client({ intents: [
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS, 
  Intents.FLAGS.GUILDS, 
  Intents.FLAGS.DIRECT_MESSAGES, 
  Intents.FLAGS.GUILD_MESSAGES, 
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
  Intents.FLAGS.GUILD_PRESENCES]});

require('dotenv').config();
const g = require('./src/giveaway.json');
//const disbut = require('discord-buttons');
//disbut(client);

const prefix = '#';

const fs = require('fs');
client.commands = new Collection();

const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./src/commands/${file}`);

    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`==========================================`);
    console.log(`Eingeloggt als ${client.user.tag} auf ${client.guilds.cache.size} Servern.`);
    console.log(`==========================================`);
    client.user.setActivity({"name": "ItIzYe", "type": "LISTENING"});   
});

client.on('messageCreate', async message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();


    if(command == 'kick'){
      client.commands.get('kick').execute(  message, args);
    }else if(command == 'ban'){
        client.commands.get('ban').execute(message, args);
    }else if(command == 'clear'){
      client.commands.get('clear').execute(message, args);
    }else if(command == 'set'){
      client.commands.get('set').execute(message, args);
    }else if(command == 'quiz'){
      client.commands.get('quiz').execute(message, args);
    }
}),

client.on("interactionCreate", async (interaction) =>{
  if(interaction.isButton()){
    if(interaction.customId === 'primary'){
      const filter = m => m.author.id === interaction.user.id
      const collector = interaction.channel.createMessageCollector({
        filter,
        max: 1,
        time: 30000,
        error: 'time'
      });

      interaction.reply({content: "Bitte gebe die `Channel-Id` des Kanals an, in den die Nachrichten gesendet werden sollen. Wenn du keinen eigenen Kanal dafür möchtest, schreibe `None`"})
      collector.on('collect', m => {});
      collector.on('end', collected => {
        collected.forEach((value) => {
          const msgcontent = value.content
          if(msgcontent.startsWith === "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9" || "0"){
            const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Mod Channels')
            .setDescription(`Sie haben <#${msgcontent}> als Kanal für die Moderationsnachrichten angegeben`)
            .setTimestamp()
          
            interaction.followUp({ephemeral: true, embeds: [embed]})
          }
          let text = {"channel": msgcontent}
          const obj = JSON.stringify(text);
          if(fs.existsSync(`./src/${interaction.guild.id}/`)){
            fs.writeFile(`./src/${interaction.guild.id}/modch.json`, obj, (err) => { 
              if (err) { 
                console.log(err); 
              }
            })
            console.log('saved')
          }else{
            fs.mkdir(`./src/${interaction.guild.id}`, (err) => { 
              if (err) { 
                console.log(err); 
              }
            })
            fs.writeFile(`./src/${interaction.guild.id}/modch.json`, obj, (err) => { 
              if (err) { 
                console.log(err); 
              }
            })
            console.log('saved')
          }
        });
      });
    }
  }
}),


client.login(process.env.Discord_Bot_Token)