const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const random = require('random');

module.exports = {
    name: 'quiz',
    description: 'Startet ein Quiz',
    execute( message, args){

        var status = true;
        var answer1 = true;
        var runde = 1;

        const qa = ['Was bedeutet der Name der russischen Raumstation `Mir` ins deutsche übersetzt? \nA) Frieden \nB) Sieg \nC) Raumstation',
        'Wann hat Venom Aimz seinen Yoututbe Kanal gegründet? \n A) 03.03.2020 \n B) 30.02.2020 \n C) 31.06.2020',
        'In welcher Sprache wurde ich geschrieben? \nA) Python \nB) Java \nC) Chinesisch',
        'Von wem wurde der Song Mulberry Street geschrieben? \nA) Twenty one Pilots \nB) Imagine Dragons \nC) Pink Floyd',
        'Welches sind die drei großen monotheistischen Weltreligionen? \nA) Judentum, Islam, Christentum \nB) Judentum, Buddismus, Christentum \nC) Islam, Hinduismus, Atheismus',
        'Das flächenmäßig kleinste Bundesland heißt? \nA) Berlin \nB)Bremen \nC) Saarland',
        'Was ist die “Goldene Himbeere”? \nA) Ein Preis für die schlechteste Leistung innerhalb eines Filmjahres \nB) Eine Nachspeise aus Russland \nC) Das Symbol einer Sekte',
        'Einen Feinschmecker nennt man auch? \nA) Gourmet \nB) Gourmed \nC) Leckermäulchen',
        'Folgt man dem Äquator um die Welt, legt man wie viele Kilometer zurück? \nA) Rund 40.070 km \nB) Rund 30.070 km \nC) Rund 80.070 km',
        'Mit welcher Tiergruppe sind die Dinosaurier am engsten verwandt? \nA) Vögeln \B) Eidechsen \nC) Alligatoren',
        'Welches Metall leitet Wärme am besten? \nA) Silber \nB) Kupfer \nC) Aluminium',
        'Wie lautet die Hauptstadt von Frankreich? \nA) Paris \nB) Amsterdam \nC) Oslo',
        'Wie lautet die Hauptstadt von Bayern? \nA) München \nB) Dortmund \nC) Stuttgart',
        'Wann endete der 2. Weltkrieg? \nA) 1945 \nB) 1950 \nC) 193',
        'Wie lautet der zweite Planet in unserem Sonnensystem? \nA) Venus \nB) Jupiter \nC) Venera',
        'Welches dieser Tiere hält keinen Winterschlaf? \nA) Eichhörnchen \nB) Fledermaus \nC) Siebenschläfer',
        'In welcher Einheit wird der elektrische Widerstand gemessen? \nA) Ohm \nB) Volt \nC) Ampere',
        'Was ist ein Oxymoron? \nA) Ein innerer Widerspruch \nB) Ein Versfuß \nC) Eine Frageform',
        'Wo fanden die Olympischen Spiele 1996 statt? \nA) Atlanta \nB) Turin \nC) Los Angeles',
        'Wer gilt als Verfasser der amerikanischen Unabhängigkeitserklärung? \nA) Thomas Jefferson \nB) Benjamin Franklin \nC) John Adams',
        'Wie viele Planeten hat unser Sonnensystem? \nA) 8 \nB) 9 \nC) 11',
        'Welches ist das höchste Amt in Deutschland? \nA) Bundespräsident \nB) Bundeskanzler \nC) Bundestagspräsident',
        '  Wie heißt die Schicht der Atmosphäre, die der Erde am nächsten ist? \nA) Troposphäre \nB) Stratosphäre \nC) Thermosphäre',
        ' Welcher Ozean liegt zwischen Europa und Amerika? \nA) Atlantischer Ozean \nB) Indischer Ozean \nC) Karibisches Meer',
        'Welches Bundesland ist flächenmäßig das größte? \nA) Bayern \nB) Baden-Würtemberg \nC) Nordrhein-Westfalen',
        ' Wie beginnt die Kreiszahl Pi (π)? \nA) 3,1415 \nB) 2,8485 \nC) 4,646',
        'Aus wessen Feder stammt „Krieg und Frieden“? \nA) Leo Tolstoi \nB) Fjodor Dostojewski \nC) Anton Tschecho',
        'Wie viele Atemzüge nimmt der menschliche Körper täglich? \nA) 20,000 täglich \nB) 10,000 täglich \nC) 30,000 täglic',
        'Wie hoch hängt ein Basketball-Korb? \nA) 3.05 Meter \nB) 2.90 Meter \nC) 3.50 Mete',
        'Aus wie vielen Kräutern ist Jägermeister gemacht? \nA) 56 \nB) 26 \nC) 6',
        'Wie viel Geld warfen Rom-Besucher im Jahr 2016 in den berühmten Trevi-Brunnen? \nA) 1.4 Mio. Euro \nB) 1,6 Mio. Euro \nC) 500,000 Eur',
        'In welchem Land wohnen die meisten Menschen? \nA) China \nB) USA \nC) Kanad',
        'Die Freiheitsstatue in New York war ein Geschenk von: \nA) Frankreich \nB) Großbritannien \nC) Kanada',
        ' Von wem stammt das Zitat: „Dies ist ein kleiner Schritt für einen Menschen, aber ein riesiger Sprung für die Menschheit.“? \nA) Neil Armstrong \nB) Elon Musk \nC) Galile',
        'Wie wird die Zahl unter dem Bruchstrich bezeichnet? \nA) Nenner \nB) Zähler \C) Teile',
        'Welcher ist der längste innerdeutsche Fluss? \nA) Rhein \nB) Weser \nC) Dona',
        ' Lautstärke misst man in? \nA) in Dezibel \nB) in Liter \nC) in Gramm'];

        const qb = [
        'Wer hat den Soundtrack für `Django Unchained` geschrieben? \n A) John Williams \n B) Ennio Morricone \n C) Hans Zimmer',
        'Welches ist der höchste Berg auf unserem Heimatplaneten? \nA) Himalaya \nB) Mount Everest \nC) Olympus Mons',
        'Wann fing der 1. Weltkrieg an? \nA) 1795 \nB) 1914 \nC) 1980',
        'Wieviele kcal hat ein Bic Mac? \nA) 200kcal \nB)503kcal \nC) Stinkstiefel',
        'Wieviele Saiten hat ein Klavier? \nA) 90 \nB) 88 \nC) 70',
        'Was ist AE (AU)? \nA) eine Variabel \nB) Astrononmische Einheit \nC) Gelbanteil in Licht',
        'Vervollständige den Namen der Serie: How I... \nA) ...cooked a Chicken \nB) ...met your Mother \nC) ...fought against Darth Vader',
        'Übersetzte `10001`: \nA) Hallo \nB) 16 \nC) Stift',
        'In welchem Jahr fand der sogenannte "Prager Frühling" statt? \nA) 1966 \nB) 1968 \nC) 1972',
        'Wann ist Powerkatze dem Server gejoint? \nA) 19th Jun 20 \nB) 30th Feb 21 \nC) 17 Dec 19',
        'Das flächenmäßig kleinste Bundesland heißt? \nA) Berlin \nB) Bremen \nC) Saarland',
        ' Was bedeutet das lateinische “carpe diem”? \nA) Genieße das Leben \nB) Nutze den Tag \nC) Dein Tag wird toll werden',
        'Welcher deutsche Herrscher trug den Beinamen “der Große”? \nA) Friedrich der I. von Preußen \nB) Friedrich II. von Preußen \nC)Friedrich der III. von Österreich',
        ' Welcher Pilz ist einer der giftigsten der Welt? \nA) Der Fliegenpilz \nB) Der Grüne Knollenblätterpilz \nC) Der Satansröhrling',
        'Welcher Schauspieler hat nicht in einem James Bond-Film mitgespielt? \nA) Timothy Dalton \nB) Leonardo DiCaprio \nC) Javier Bardem',
        'Was meinen Weinkenner, wenn sie das Wort “rassig” verwenden? \nA) Es beschreibt alkohol- und körperreiche Weine. \nB) Es beschreibt Weine mit einer ausgeglichenen, aber ausgeprägten Säure. \nC) Es beschreibt Weine, die im Geschmack an frisches Obst erinnern.',
        'Wo herrscht kein Linksverkehr? \nA) Irland \nB) Island \nC) Großbritannien',
        'Wie viele Nieren hat ein Mensch im Normalfall? \nA) 3 \nB) 2 \nC) 5',
        'Wie lange geht ein Marathon? \nA) 25 Kilometer \nB) 42,195 Kilometer \nC) 1000 Meter',
        'In welchem Jahr wurde der Euro als Bargeld eingeführt? \nA) 2000 \nB) 2002 \nC) 2005',
        'Welches Vitamin wird mithilfe von Sonnenlicht im Körper gebildet? \nA) Vitamin E \nB) Vitamin D \nC) Vitamin A',
        'In welcher Stadt lebte der Detektiv Sherlock Holmes? \nA) Köln \nB) London \nC) Manchester',
        'Die Zeichentrick-Familie Simpsons lebt in welcher Stadt? \nA) New York \nC) Springfield \nC) Minnesota',
        'Welcher Planet unseres Sonnensystems wird als Roter Planet bezeichnet? \nA) Jupiter \nB) Mars \nC) Neptun',
        'Wie heißt die Hauptstadt der Slowakei? \nA) Prag \nB) Bratislava \nC) Ljubljan',
        'Wie viele Zähne hat ein erwachsener Mensch normalerweise? \nA) 26 \nB) 32 \nC) 36',
        'Wie heißt die Hauptstadt von Thüringen? \nA) Magdeburg \nB) Erfurt \nC) Dresden',
        'Wofür steht das „L“ im Sender RTL? \nA) London \nB) Luxenbourg \nC) Liechtenstein',
        'Was soll Cäsar gesagt haben, als er den Rubikon überquerte? \nA) veni, vidi, vici \nB) alea iacta est \nC) et tu, brute',
        'Wie viele Oscars gewann der Film „Titanic“? \nA) 10 \nB) 11 \nC) 13',
        'Wie lautet das chemische Symbol für Blei? \nA) Bl \nB) Pb \nC) Be',
        'Welchen Namen trägt die Universität Frankfurt am Main? \nA) Bertolt Brecht \nB) Johann Wolfgang von Goethe \nC) Heinrich Heine',
        'An welchem Datum fiel die Berliner Mauer? \nA) 3. Oktober 1990 \nB) 9. November 1989 \nC) 8. Oktober 1989',
        'In welchem Jahr ist die Titanic am 15. April auf ihrer Jungfernfahrt von Southampton im Atlantik gesunken? \A) 1920 \nB) 1912 \nC) 1908',
        'Was ist die Hauptstadt von Portugal? \nA) Porto \nB) Lissabon \nC) Lago',
        'Was ist das chemische Symbol für Silber? \nA) An \nB) Ag \nC) Af',
        'Wie viele Herzen hat ein Oktopus? \nA) Zwei \nB) Drei \nC) Vier',
        'Wie viele Knochen hat ein Erwachsenenkörper? \nA) 250 \nB) 206 \nC) 215',
        'Welcher Sänger war unter anderem als “The King of Pop” und “The Gloved One” bekannt? \nA)Elvis Presley \nB) Michael Jackson \nC) Frank Sinatra',
        'Wie viele Liter Bier werden in Deutschland pro Kopf jährlich getrunken? \nA) 170 Liter \nB) 100 Liter \nC) 200 Liter',
        'Wie lange hat Goethe an seinem „Faust“ gearbeitet? \nA) 20 Jahre \nB) 64 Jahre \nC) 10 Jahre',
        'Nach welcher Zeit feiert man die „Petersilienhochzeit“? \nA) Nach 12 Jahren \nB) Nach 12 1/2 Jahren \nC) Nach 11 Jahren',
        'Welches Land ist flächenmäßig das zweitgrößte der Erde? \nA) Russland \nB) Kanada \nC) Frankreich',
        ' Welcher ist der längste Fluss der Welt? \nA) Nil \nB) Amazonas \nC) Rein',
        'Wie viel wog der schwerste Mensch der Welt? \nA) 445 \nB) 544 \nC) 677',
        'Bei welchem Wert liegt der Weltrekord im Dauerjodeln? \nA) 3 Std. 15 Min \nB) 15 Std. 11 Sek. \nC) 9 Std. 31 Sek.',
        'In welcher Stadt befinden sich die Pyramiden? \nA) Kairo \nB) Gizeh \nC) Alexandria',
        'Auf welchem Kontinent liegt die Wüste Sahara? \nA) Asien \nB) Afrika \nC) Europa',
        'Von wem stammt die Relativitätstheorie? \nA) Stephen Hawking \nB) Albert Einstein \nC) Marie Curie',
        'Auf welcher Buchreihe basiert die Erfolgsserie „Game of Thrones“? \nA) Earth, Wind and Fire \nB) A Song of Ice and Fire \nC) Rain, Thunder and Lightning',
        'In welchem Land fand die sogenannte Februarrevolution statt? \nA) Frankreich \nB) Russland \nC) Italien',
        'Welche Stadt liegt am südlichsten? \nA) Stuttgart \nB) Konstanz \nC) Augsburg',
        'Mit wie vielen Nachbarländern teilt Deutschland sich eine Grenze? \nA) 8 \nB) 9 \nC) 10',
        'Wie heißt die Hauptstadt von Australien? \nA) Sydney \nB) Canberra \nC) Adelaide',
        'Von welchem Kontinent aus begann die Verbreitung des Homo sapiens? \nA) Asien \nB) Afrika \nC) Europa',
        '“Kunst wäscht den Staub des Alltags von der Seele.” Von wem stammt das Zitat? \nA) Andy Warhol \nB) Pablo Picasso \nC) Claude Monet'];

        const qc = ['Wer ist Venom Aimz? \n A) Ein Food-Blogger \n B) Ein Mathematiker \n C) Ein Youtuber',
        'Wann wurden die Beatles gegründet? \nA)1897 \nB) 2001 \nC) 1960',
        'Wie heißt der Ort, der auf der Erde am weitesten von jeglicher Zivilisation entfernt ist? \nA) Olymp \nB) ISS \nC) Point Nemo',
        'Wann ist Bill Clinton Präsident der USA geworden? \nA) 1986 \nB) 1996 \nC) 1992',
        'Wie heißt der neueste amerikanische Marsrover? \nA) Couriosity \nB) Arinane 5 \nC) Perseverance',
        'Wo liegt Alcatraz? \nA) Vor New York \nB) Im Uralgebirge \nC) Vor San Francisco',
        'Wie lang ist ein Geodreieck? \nA) 12cm \nB) 17cm \nC) 14cm',
        'Welche Gürtelfarbe existiert nicht im Kampfsport Karate? \nA) Schwarz \nB) Braun \nC) Rot',
        'Welche Insel gehört nicht zu den balearischen Inseln? \nA) Ibiza \nB) Cabrera \nC) Gran Canaria',
        'Wer oder was ist eine “Druidin”? \nA) Eine Kräutersammlerin im Harz \nB) Ein Magnetfeld \nC) Eine Priesterin oder Zauberin der keltischen Religion',
        'Wie viele Bundesländer hat Deutschland? \nA) 13 \nB) 9 \nC) 16',
        'Wie viele Milchzähne bekommt ein Kind normalerweise? \nA) 18 \nC) 32 \nC) 20',
        'In welcher Stadt findet sich Big Ben? \nA) New York \nB) Hong Kong \nC) London',
        'Wer wählt den Bundespräsidenten? \nA) Bundeskanzler \nB) Bundesrat \nC) Bundesversammlung',
        'Wie heißt die Hauptstadt von Äthiopien? \nA) Mogadischu \nB) Harare \nC) Addis Abeba',
        'Wer ist Rekordtorschütze der Bundesliga? \nA) Jupp Heynckes \nB) Manfred Burgsmüller \nC) Gerd Müller',
        'Wie beginnt Artikel 1 des deutschen Grundgesetzes? \nA) „Alle Menschen sind vor dem Gesetz gleich.“ \nB) „Jeder hat das Recht, seine Meinung in Wort, Schrift und Bild frei zu äußern.“ \C) „Die Würde des Menschen ist unantastbar.“',
        'Welche Adresse ist mit Sherlock Holmes verbunden? \nA) Downing Street 10 \nB) Abbey Road 42 \C) 221b Baker Street',
        'In welchem Meer liegt die Insel Hawaii? \nA) Indischer Ozean \nB) Karibisches Meer \nC) Pazifischer Ozean',
        'Was ist ein Sonett? \nA) Ein Musikinstrument \nB) Ein Pilz \nC) Eine Gedichtsform',
        'Wer schrieb die Harry Potter Bücher? \nA) E.L. James \nB) J.R.R. Tolkien \nC) Joanne K. Rowling',
        'Wie lang ist die Chinesische Mauer (gerundet)? \nA) 15.000 Kilometer \nB) 18.000 Kilometer \nC) 21.000 Kilometer',
        'Welcher Planet unseres Sonnensystems ist der Sonne am nächsten? \nA) Mars \nB) Jupiter \nC) Merkur',
        'Wie lange dauerte der hundertjährige Krieg? \nA) 100 Jahre \nB) 150 Jahre \nC) 116 Jahre',
        'Wie viel Prozent der Erde sind circa von Wasser bedeckt? \nA) 50 Prozent \nB) 60 Prozent \nC) 70 Prozent',
        'Wie viele Farben hat die dänische Flagge? \nA) drei \nB) vier \nC) Zwei',
        'Beim Poolbillard steht welche Zahl auf der schwarzen Kugel? \nA) 0 \nB) 9 \nC) 8'];

        const next_round = ['Willst du weiterspielen?', 'Noch eine Runde? :)',
        'wenndunocheinerundespielenwillstschreibstdujetztja', 'Man munkelt du willst nochmal spielen?',
        'Du hast das Ende erreicht....oder doch nicht? In der ferne siehst du ein Netherportal! Machst du dich auf um es zu erunden?',
        'Kevin braucht Hilfe bei einer Matheaufgabe...hilfst du ihm?',
        'Da du keine Hobbys zu haben scheinst wette ich, dass du noch eine Runde spielst'];

        const comment = ['Du hast recht! :tada:', 'Juhu! Du hast recht :tada:', 'Du bist wohl ein echter Fanboy :)',
        'Na dass hätte mich gewundert wenn du dass nicht gewusst hättest!', 'Hast du das studiert?',
        'Arbeitest du für NASA????', 'Sogar die Sintflut macht vor deinem Wissen halt'];

        const wans = ['Das ist Falsch', 'Da hast du dir wohl etwas nicht richtig gemerkt', 'Sogar Kevin hätte das gewusst', 
        'Lincoln hätte sich im Grab umgedreht hätte er das gesehen', 'Was reimst du dir da zusammen?',
        '* Died of cringe *', 'Das ist der Grund warum keine Aliens auf die Erde kommen wollen',
        '* Gott blickt verzweifelt auf die Menscheit hinab *'];

        const aa = ["A", "a", "1"];
        const bb = ["B", "b", "2"];
        const cc = ["C", "c", "3"];

        const Ja = ['Ja', 'ja', 'j', 'Y', 'J', 'Yes', 'yes', 'y'];
        const Nein = ['Nein', 'nein', 'n', 'no'];

        console.log("test 1 Abgeschlossen")

        while(status === true && answer1 === true){
            let questa = qa[~~(Math.random() * qa.length)];
            let questb = qb[~~(Math.random() * qb.length)];
            let questc = qc[~~(Math.random() * qc.length)];

            let qu = [questa, questb, questc];
            let quest = qu[~~(Math.random() * qu.length)];
            let wans1 = wans[~~(Math.random() * wans.length)];
            let next_round1 = next_round[~~(Math.random() * next_round.length)];
            let comment1 = comment[~~(Math.random() * comment)];

            

            const exampleEmbed = new MessageEmbed()
            .setColor('ORANGE')
            .setTitle('Supercooles Quiz')
            .setDescription(`Powered by Drippy`)
            .addFields({name: `Frage ${runde}`, value: quest})
            .setTimestamp()

            message.channel.send({ embeds: [exampleEmbed]})

            const filter = m => m.author.id === message.author.id

            const collector = message.channel.createMessageCollector({
                filter,
                max: 1,
                time: 10000,
                error: 'time'
            });

            message.channel.send({content: "Welche Settings möchtest du anpassen?"})
            collector.on('collect', m => {});
            collector.on('end', collected =>{
                collected.forEach((value) => {
                    console.log(value.content)
                    const msgcontent = value.content
                    if(quest in questa) {
                        if(msgcontent in aa){
                            let status = true;
                            let runde = runde + 1;
                            
                            const exampleEmbed1 = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('Supercooles Quiz')
                            .setDescription(`Powered by Drippy`)
                            .addFields({name:random(comment), value:random(next_round)})
                            .setTimestamp()

                            message.channel.send({ embeds: [exampleEmbed1]})

                            const filter = m => m.author.id === message.author.id

                            const collector = message.channel.createMessageCollector({
                                filter,
                                max: 1,
                                time: 10000,
                                error: 'time'
                            });

                            message.channel.send({content: "Welche Settings möchtest du anpassen?"})
                            collector.on('collect', m => {});
                            collector.on('end', collected =>{
                                collected.forEach((value) => {
                                    console.log(value.content)
                                    const msgcontent1 = value.content

                                    if(msgcontent1 in Ja){
                                        answer1 = true
                                    }else{
                                        answer1 = false

                                        const exampleEmbed2 = new MessageEmbed()
                                        .setColor('BLUE')
                                        .setTitle('Supercooles Quiz')
                                        .setDescription(`Powered by Drippy`)
                                        .addFields({name:`Wow, du bist bei Runde ${runde} ausgestiegen!`, value: "In Bearbeitung"})
                                        .setTimestamp()

                                        message.channel.send({ embeds: [exampleEmbed2]})
                                    }
                                });
                            });

                        }else{
                            status = false;

                            const exampleEmbed2 = new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Supercooles Quiz')
                            .setDescription(`Powered by Drippy`)
                            .addFields({name: wans1, value:` Du bist bei Runde ${runde} rausgeflogen. Schreibe #quiz in den Chat um das Quiz neuzustarten`})
                            .setTimestamp()

                            message.channel.send({ embeds: [exampleEmbed2]})
                        }  
                    }else if(quest in questb) {
                        if(msgcontent in bb){
                            const status = true;
                            const runde = runde + 1;
                            
                            const exampleEmbed1 = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('Supercooles Quiz')
                            .setDescription(`Powered by Drippy`)
                            .addFields({name: comment1, value: next_round1})
                            .setTimestamp()

                            message.channel.send({ embeds: [exampleEmbed1]})

                            const filter = m => m.author.id === message.author.id

                            const collector = message.channel.createMessageCollector({
                                filter,
                                max: 1,
                                time: 10000,
                                error: 'time'
                            });

                            message.channel.send({content: "Welche Settings möchtest du anpassen?"})
                            collector.on('collect', m => {});
                            collector.on('end', collected =>{
                                collected.forEach((value) => {
                                    console.log(value.content)
                                    const msgcontent1 = value.content

                                    if(msgcontent1 in Ja){
                                        answer1 = true
                                    }else{
                                        answer1 = false

                                        const exampleEmbed2 = new MessageEmbed()
                                        .setColor('BLUE')
                                        .setTitle('Supercooles Quiz')
                                        .setDescription(`Powered by Drippy`)
                                        .addFields({name:`Wow, du bist bei Runde ${runde} ausgestiegen!`, value: "In Bearbeitung"})
                                        .setTimestamp()

                                        message.channel.send({ embeds: [exampleEmbed2]})
                                    }
                                });
                            });
                        }else{
                            status = false;

                            const exampleEmbed2 = new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Supercooles Quiz')
                            .setDescription(`Powered by Drippy`)
                            .addFields({name: wans1, value:` Du bist bei Runde ${runde} rausgeflogen. Schreibe #quiz in den Chat um das Quiz neuzustarten`})
                            .setTimestamp()

                            message.channel.send({ embeds: [exampleEmbed2]})
                        };
                    }else if(quest in questc) {
                        if(msgcontent in cc){
                            let status = true;
                            let runde = runde + 1;
                            
                            const exampleEmbed1 = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('Supercooles Quiz')
                            .setDescription(`Powered by Drippy`)
                            .addFields({name: comment1, value: next_round1})
                            .setTimestamp()

                            message.channel.send({ embeds: [exampleEmbed1]})

                            const filter = m => m.author.id === message.author.id

                            const collector = message.channel.createMessageCollector({
                                filter,
                                max: 1,
                                time: 10000,
                                error: 'time'
                            });
                            message.channel.send({content: "Welche Settings möchtest du anpassen?"})
                            collector.on('collect', m => {});
                            collector.on('end', collected =>{
                                collected.forEach((value) => {
                                    console.log(value.content)
                                    const msgcontent1 = value.content

                                    if(msgcontent1 in Ja){
                                        answer1 = true
                                    }else{
                                        answer1 = false

                                        const exampleEmbed2 = new MessageEmbed()
                                        .setColor('BLUE')
                                        .setTitle('Supercooles Quiz')
                                        .setDescription(`Powered by Drippy`)
                                        .addFields({name:`Wow, du bist bei Runde ${runde} ausgestiegen!`, value: "In Bearbeitung"})
                                        .setTimestamp()

                                        message.channel.send({ embeds: [exampleEmbed2]})
                                    }
                                });
                            });
                        }else{
                            status = false;

                            const exampleEmbed2 = new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Supercooles Quiz')
                            .setDescription(`Powered by Drippy`)
                            .addField({name: wans1, value:` Du bist bei Runde ${runde} rausgeflogen. Schreibe #quiz in den Chat um das Quiz neuzustarten`})
                            .setTimestamp()

                            message.channel.send({ embeds: exampleEmbed2})
                        };
                    };
                });
                
            });
        };
    }
}