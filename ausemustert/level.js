const {Client , Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
const Level = require('../../models/Level.js');
const calculateLevelXp = require('../../utils/calculateLevelXp.js');
//const language = require("../../handlers/languages");
const pb = {
    le: '<:_le:1194078627353083945>',
    me: '<:_me:1194078620545712168>',
    re: '<:_re:1194078622621909092>',
    lf: '<:_lf:1194078628527472700>',
    mf: '<:_mf:1194078625021046824>',
    rf: '<:_rf:1194078623775338607>',
};

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     *
     */
    name: 'level',
    description: "Shows your/someone's level.",
    deleted: false,
    devOnly: true,
    options: [
        {name: 'target-user',
            description: "The user whose rank you want to see",
            type: ApplicationCommandOptionType.Mentionable}
    ],


    callback: async (client, interaction) => {
        if(!interaction.inGuild()){
            interaction.reply("Du kannst den Command nur in einem Server benutzen")
        }

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guildId,
        });

        if(!fetchedLevel){
            interaction.editReply(
                mentionedUserId ? `${targetUserObj.user.tag} hat keine Level` : "Du hast keine Level"
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guildId }).select('-_id userId level xp');
        allLevels.sort((a, b)=> {
            if(a.level === b.level){
                return b.xp - a.xp;
            }else {
                return b.level - a.level;
            }
        });
        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

        ///Create Card///



        const progressBarLength = 14;
        const filledSquares = Math.round((fetchedLevel.xp / calculateLevelXp(fetchedLevel.level) ) * progressBarLength) || 0;
        console.log(filledSquares)
        const emptySquares = progressBarLength - filledSquares || 0;

        if (!filledSquares && !emptySquares) {
            let emptySquares = progressBarLength;
        }

        const progressBar =
            (filledSquares ? pb.lf : pb.le) +
            (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
            (filledSquares === progressBarLength ? pb.rf : pb.re);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setThumbnail(targetUserObj.displayAvatarURL({ extension: "jpg" }))
            .setTitle('RANK')
            .setDescription(targetUserObj.user.username)
            .setFields(
                {name: 'Rank', value: `${currentRank}`, inline: true},
                {name: 'Level', value: `${fetchedLevel.level}`, inline:true},
                {name: 'XP', value: `${fetchedLevel.xp}`, inline: true},
                {name: 'XP bis zum nächsten Level', value: `${calculateLevelXp(fetchedLevel.level)}`},
                {name: 'Fortschritt', value:`${progressBar}`},
            )

        interaction.editReply({embeds: [embed]})




        /*
                const canvas = createCanvas(1000, 333)
                const ctx = canvas.getContext("2d");
                const background = await loadImage('https://hdqwalls.com/wallpapers/simple-subtle-abstract-dark-minimalism-4k-u9.jpg');
                ctx.fillStyle = '#A3A3A3'
                ctx.fillRect(0,0,canvas.width,canvas.height)
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#A3A3A3"
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "#000000"
                ctx.fillRect(180, 216, 775, 65);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeRect(180, 216, 775, 65);
                ctx.stroke();

                ctx.fillStyle = '#FFC300';
                ctx.globalAlpha = 0.6;
                ctx.fillRect(200, 216, calculateLevelXp(fetchedLevel.level), 65);
                ctx.fill();
                ctx.globalAlpha = 1;

                ctx.font = '30px sans-serif';
                ctx.textAlign = "center";
                ctx.fillStyle = '#A3A3A3';
                ctx.fillText(`${fetchedLevel.xp} XP`, 600, 260);

                ctx.font = '35px sans-serif';
                ctx.textAlign = "left";
                ctx.fillText(`${targetUserObj.user.username}`, 325, 125);

                ctx.font = '40px sans-serif';
                ctx.fillText("Level: ", 350, 170);
                ctx.fillText(fetchedLevel.level, 500, 170);

                ctx.font = '40px sans-serif';
                ctx.fillText("Rank: ", 700, 170);
                ctx.fillText(currentRank, 830, 170);

                ctx.arc(170, 160, 120, 0, Math.PI * 2, true);
                ctx.lineWidth = 6;
                ctx.strokeStyle = "WHITE"
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                const avatar = await loadImage(targetUserObj.displayAvatarURL({ extension: "jpg" }));
                ctx.drawImage(avatar, 40, 40, 250, 250);

                const attachments = new AttachmentBuilder(canvas.toBuffer(), "rank.png");
                interaction.editReply({files: [attachments]});

         */
    }


}

